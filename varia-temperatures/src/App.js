/** @format */

import './App.css';
import React from 'react';
import Particles from 'react-tsparticles';
import SWIntro from './images/StarWars.mp3';
import DeathStar from './images/Death-Star-SWCT.png';
import SWIcon from './images/Star-Wars-PNG-Image-84345.png';
import X from './images/Cross.png';
import ReactPlayer from 'react-player';
import { particleData } from './variables-functions/particles.js';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const apiKey = process.env.REACT_APP_REST_APIKEY;
const restUrl = process.env.REACT_APP_REST_URL;
const options = {
	method: 'GET',
	headers: {
		'cache-control': 'no-cache',
		'Content-Type': 'application/json',
	},
};
class App extends React.Component {
	state = {
		DeviceData: [],
		playing: false,
		date: new Date(),
		openIndex: 0,
	};
	componentDidMount() {
		document.getElementById('caption').style.opacity = '100%';
		this.getHistory();
		setTimeout(function () {
			document.getElementById('DeathStar').style.opacity = '80%';
		}, 30000);
	}

	async getHistory() {
		const onlineStack = [];
		const offlineStack = [];
		await fetch(restUrl + apiKey, options)
			.then((response) => response.json())
			.then((data) => {
				const WithOpensData = data.map((v) => ({ ...v, Open: false }));
				WithOpensData.forEach((unit) => {
					if (unit.Online === true) {
						onlineStack.push(unit);
					} else {
						offlineStack.push(unit);
					}
				});

				onlineStack.sort(function (a, b) {
					return a.Name.substr(-3, 3) - b.Name.substr(-3, 3);
				});
				offlineStack.sort(function (a, b) {
					return a.Name.substr(-3, 3) - b.Name.substr(-3, 3);
				});
				this.setState({ DeviceData: [...onlineStack, ...offlineStack] });
			});
	}

	setOpen(id) {
		let isAnythingOpened = false;
		this.state.DeviceData.forEach((unit) => {
			if (unit.UnitID === id) {
				if (unit.Open) {
					unit.Open = false;
				} else {
					unit.Open = true;
					isAnythingOpened = true;
				}
			} else {
				unit.Open = false;
			}
			this.setState({ DeviceData: this.state.DeviceData });
		});
		this.state.DeviceData.forEach((unit) => {
			if (isAnythingOpened) {
				document.getElementById(unit.UnitID).style.opacity = '0%';
			} else {
				document.getElementById(unit.UnitID).style.opacity = '100%';
			}
		});
	}

	openContainer(unit) {
		if (unit.Open) {
			const classNumber = 'Class ' + unit.Name.replace(/\D/g, '');
			return (
				<div id={'containerOpen'} key={unit.UnitID} className={'containerOpen'}>
					<div className='containerOpenText'>
						<p className='textOpen'>{classNumber}</p>
						<p className='textOpen'>Status: {unit.Online ? 'Online' : 'Offline'}</p>
						<p className='textOpen'>{`Humidity: ${unit.Humidity}`}%</p>
						<p className='textOpen'>{`Temperature: ${unit.Temperature}`}℃</p>
						<div className='CrossImage'>
							<img
								className='CrossImage'
								alt='error'
								src={X}
								onClick={() => {
									document.getElementById('containerOpen').style.animation = 'CLOSEContainer 0.5s';

									setTimeout(() => {
										this.setOpen(unit.UnitID);
									}, 50);
								}}
							/>
						</div>
					</div>

					<div className='Chart'>
						<HighchartsReact
							highcharts={Highcharts}
							constructorType={'stockChart'}
							options={this.GetData(unit)}
						/>
					</div>
				</div>
			);
		}
	}

	GetData(UnitData) {
		const History = UnitData.History;

		let HumData = [];
		let TempData = [];

		History.forEach((unit) => {
			if (unit.Online) {
				TempData.push([unit.Date, unit.Temperature]);
			}
		});
		History.forEach((unit) => {
			if (unit.Online) {
				HumData.push([unit.Date, unit.Humidity]);
			}
		});

		const options = {
			series: [
				{
					name: 'Temperature',
					data: TempData,
					color: '#ff6961',
					step: '5',
				},
				{
					name: 'Humidity',
					data: HumData,
					step: '5',
				},
			],
		};
		return options;
	}

	// ℙᚱ⊙ᶨeꓘ☂
	render() {
		return (
			<div id='App' className='App'>
				<Particles params={particleData} id='bg' />
				<div id='Main'>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link
						href='https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap'
						rel='stylesheet'
					/>

					<h1 id='caption' style={{ userSelect: 'none', marginBottom: '100px' }}>
						Varia Temperatures
					</h1>

					<div className='containers'>
						{this.state.DeviceData.map((unit, i) => {
							const RightClass = unit.Online ? 'containerOnline' : 'containerOffline';
							const classNumber = 'Class ' + unit.Name.replace(/\D/g, '');

							return (
								<div key={i} style={{ display: 'inline-block' }}>
									<div id={unit.UnitID} className={RightClass} onClick={() => this.setOpen(unit.UnitID)}>
										<p className='text'>{classNumber}</p>
										<p className='text'>{unit.Online ? 'Online' : 'Offline'}</p>
										<p className='text'>{unit.Humidity}%</p>
										<p className='text'>{unit.Temperature}°C</p>
									</div>
									{this.openContainer(unit)}
								</div>
							);
						})}
					</div>

					<ReactPlayer url={SWIntro} playing={this.state.playing} volume={0.3} height={1} />
					<div id='DeathStar'>
						<img className='DeathStar' alt='error' src={DeathStar} onClick={() => this.play()} />
					</div>
				</div>

				<div id='scroller'>
					<div id='content'>
						<p id='title'>Episode V</p>
						<p> </p>
						<p id='subtitle'>The Empire Strikes Back</p>
						<p> </p>
						<p id='contentText'>
							It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops
							have driven the Rebel forces from their hidden base and pursued them across the galaxy.
						</p>
						<p id='contentText'>
							Evading the dreaded Imperial Starfleet, a group of freedom fighters led by Luke Skywalker have
							established a new secret base on the remote ice world of Hoth.
						</p>
						<p id='contentText'>
							The evil lord Darth Vader, obsessed with finding young Skywalker, has dispatched thousands of
							remote probes into the far reaches of space....
						</p>
					</div>
				</div>
				<div className='SWIcon' id='SWIcon'>
					<img className='swLogo' alt='error' src={SWIcon} />
				</div>
			</div>
		);
	}
	play() {
		this.setState({ playing: true });
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.getElementById('Main').style.opacity = '0%';
		document.getElementById('Main').style.transition = '1s';
		document.getElementById('SWIcon').style.width = 'inherit';
		document.getElementById('content').style.animation = 'scroller 128s linear 9s';
		setTimeout(function () {
			document.getElementById('scroller').style.width = '20em';
			document.getElementById('SWIcon').style.opacity = '100%';
			document.getElementById('SWIcon').style.animation = 'logo 15s ease-out';
			setTimeout(function () {
				document.getElementById('SWIcon').style.opacity = '0%';
				document.getElementById('SWIcon').style.width = '1px';
				document.getElementById('DeathStar').style.opacity = '0%';
			}, 15000);
		}, 2000);
		setTimeout(function () {
			document.getElementById('scroller').style.width = '0px';
			document.getElementById('Main').style.transition = '2s';
			document.getElementById('Main').style.opacity = '100%';
		}, 78500);
	}
}

export default App;
