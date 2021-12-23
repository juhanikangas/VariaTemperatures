/** @format */
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const unitCollection = require('../models/unitCollection');
const token = 'b7caca7f36fdb2bbc42998b31c4c93833994fe39';
const authorizationHeader = 'Bearer ' + token;
const reqOpt = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		Authorization: authorizationHeader,
	},
};
const unit_id_list = [];
const DeviceData = [];
let firstRender = true;
let unitIndex = 0;
doEveryHour();
setInterval(() => doEveryHour(), 60000);

//checks if given item is in the unit id list already
function checkIfNew(item) {
	if (unit_id_list.includes(item.id)) {
		return false;
	}
	return true;
}

//fetches devices from particle.io and checks if there are any new devices configured and if there is it pushes it to mongo db
async function doEveryHour() {
	let itemAdded = false;
	await fetch('https://api.particle.io/v1/devices', reqOpt)
		.then((response) => response.json())
		.then((data) => {
			for (let i = 0; i < data.length; i++) {
				const item = data[i];
				if (item.name !== null) {
					if (item.name.includes('TempHum')) {
						if (checkIfNew(item)) {
							itemAdded = true;
							unit_id_list.push(item.id);
							mapStats(
								{
									UnitID: item.id,
									Online: item.connected,
									Temperature: '...',
									Humidity: '...',
									Name: item.name,
								},
								false
							);
						}
					}
				}
			}
			if (itemAdded) {
				addUnits(DeviceData);
				itemAdded = false;
			}
			updateStats(unit_id_list[0]);
		})
		.catch((error) => {
			console.log(error);
		});
}

//fetches new data from particle.io and pushes it to mongodb
async function updateStats(UpdatedUnit) {
	const url = 'https://api.particle.io/v1/devices/' + UpdatedUnit;
	let Tem = '0';
	let Hum = '0';
	let online = DeviceData[unitIndex].Online;
	let Name = DeviceData[unitIndex].Name;
	if (online) {
		await Promise.all([
			fetch(url + '/temperature', reqOpt).then((resp) => resp.json()),
			fetch(url + '/humidity', reqOpt).then((resp) => resp.json()),
		])
			.then((data) => {
				Tem = data[0].result;
				Hum = data[1].result;
			})
			.catch((error) => {
				console.log(error);
			});
	}
	mapStats(
		{
			Online: online,
			Temperature: Tem ? Tem : 0,
			Humidity: Hum ? Hum : 0,
			Name: Name,
			UnitID: unit_id_list[unitIndex],
		},
		true
	);
	unitIndex += 1;
	if (unitIndex === unit_id_list.length) {
		firstRender = false;
		unitIndex = 0;
		await updateHistory();
		await deleteOldHistory();
	} else {
		updateStats(unit_id_list[unitIndex]);
	}
}

//Device data has all current data of the devices, this function updates the variable so it has all the newest data
function mapStats(data, update) {
	if ((update === false) & (firstRender === true)) {
		DeviceData.push(data);
	} else {
		DeviceData[unitIndex] = data;
	}
}

//adds a new unit to mongo db
async function addUnits(DeviceData) {
	const addedUnits = [];
	await DeviceData.forEach((unit) => {
		const unitID = unit.UnitID;
		const unitName = unit.Name;
		const newUnit = new unitCollection({ unitID, unitName });
		unitCollection.find({ unitID: unitID }).then((data) => {
			if (data[0] === undefined) {
				newUnit
					.save()
					.then((data) => addedUnits.push(unit))
					.catch((err) => console.log(err));
			}
		});
	});
}

//adds new data to the devices in mongo db
async function updateHistory() {
	await DeviceData.forEach((unit) => {
		const dateInMilliseconds = new Date().getTime();
		const newData = {
			Date: dateInMilliseconds,
			Temperature: unit.Temperature,
			Humidity: unit.Humidity,
			Online: unit.Online,
		};
		unitCollection
			.updateOne({ unitID: unit.UnitID }, { $push: { unitHistory: newData } })
			.then((data) => {})
			.catch((err) => console.log(err));
	});
}
//deletes devices history if its older than 5 years, so the database wont get full
async function deleteOldHistory() {
	const fiveYearsAgo = new Date().getTime() - 157788000000;
	await unitCollection
		.updateMany({}, { $pull: { unitHistory: { Date: { $lt: fiveYearsAgo } } } })
		.then((data) => {})
		.catch((err) => console.log(err));
}
//returns data from the devices to frontend
router.get('/getHistory', async (req, res) => {
	await unitCollection
		.find()
		.then((data) => {
			const deviceData = [];
			data.forEach((unit) => {
				deviceData.push({
					UnitID: unit.unitID,
					Name: unit.unitName,
					Temperature: unit.unitHistory[unit.unitHistory.length - 1].Temperature,
					Humidity: unit.unitHistory[unit.unitHistory.length - 1].Humidity,
					Online: unit.unitHistory[unit.unitHistory.length - 1].Online,
				});
			});
			res.json(deviceData);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
