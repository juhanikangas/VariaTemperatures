/** @format */

import '../styles/globals.css';
import './App.css';
import React from 'react';
import ThermoMeter from '../images/ThermoWhite.png';
import Image from 'next/image';
import Particles from 'react-particles-js';
import SWIntro from '../images/StarWars.mp3';
import DeathStar from '../images/Death-Star-SWCT.png';
import SWIcon from '../images/Star-Wars-PNG-Image-84345.png';
import ReactPlayer from 'react-player';
import { particleData } from '../variables-functions/particles.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
class App extends React.Component {
	state = {
		DeviceData: [],
		playing: false,
		date: new Date(),
	};

	async doEveryHour() {
		const apiKey = process.env.REST_APIKEY;
		const restUrl = process.env.REST_URL;
		const options = {
			method: 'GET',
			headers: {
				'cache-control': 'no-cache',
				'Content-Type': 'application/json',
			},
		};
		await fetch(restUrl + apiKey, options)
			.then((response) => response.json())
			.then((data) => {
				const WithOpensData = data.map((v) => ({ ...v, Open: false }));
				this.setState({ DeviceData: WithOpensData });
			});
		console.log(this.state.DeviceData);
	}

	componentDidMount() {
		this.doEveryHour();
		this.interval = setInterval(() => this.doEveryHour(), 3600000);

		setTimeout(function () {
			document.getElementById('DeathStar').style.opacity = '100%';
		}, 30000);
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

		//  Scroller div is on the way
		//var ScrollerAfter = document.createElement("Style")
		setTimeout(function () {
			document.getElementById('scroller').style.width = '20em';
			//document.getElementById('scroller').style.background = 'linear-gradient(black,transparent)' // scoller::after\

			//ScrollerAfter.innerHTML ="#scroller::after {position: absolute; content: ''; bottom: 60%; left: 0; right: 0; top: 0;background: linear-gradient(black,transparent);}";
			//document.head.appendChild(ScrollerAfter)

			document.getElementById('SWIcon').style.opacity = '100%';
			document.getElementById('SWIcon').style.animation = 'logo 15s ease-out';
			setTimeout(function () {
				document.getElementById('SWIcon').style.opacity = '0%';
				document.getElementById('SWIcon').style.width = '1px';
				document.getElementById('DeathStar').style.opacity = '0%';
			}, 15000);
		}, 2000);

		setTimeout(function () {
			//ScrollerAfter.innerHTML = ScrollerAfter.innerHTML.replace("background: linear-gradient(transparent)");

			document.getElementById('scroller').style.width = '0px';
			document.getElementById('Main').style.transition = '2s';
			document.getElementById('Main').style.opacity = '100%';
		}, 78500);
	}
	setOpen(id) {
		let tempData = this.state.DeviceData;
		for (var i = 0; i < tempData.length; i++) {
			if (tempData[i].UnitID === id) {
				if (tempData[i].Open) {
					tempData[i].Open = false;
				} else {
					tempData[i].Open = true;
				}
				this.setState({ DeviceData: tempData });
				console.log(this.state.DeviceData);
				return;
			}
		}
	}

	getHistory(Data, val, time) {
		console.log(Data[Data.length - 1].Date - time, Data[0].Date);
		let myHistory = Data.map((u) => {
			while (Data[Data.length - 1].Date - time < u.Date) {
				if (val === 0) {
					let D = new Date(u.Date);
					let Minutes = D.getMinutes();
					if (Minutes < 10) {
						Minutes = '0' + Minutes;
					}
					return D.toLocaleDateString('en-GB') + ' ' + D.getHours() + ':' + Minutes;
				} else if (val === 1) {
					return u.Humidity;
				} else if (val === 2) {
					return u.Temperature;
				}
			}
		}).filter((n) => n);
		return myHistory;
	}

	getFullHistoryData(unitData, time) {
		let myData = {
			labels: this.getHistory(unitData, 0, time),
			datasets: [
				{
					label: 'HUM',
					fill: false,
					lineTension: 0.5,
					backgroundColor: 'rgba(75,192,192,0.4)',
					borderColor: 'rgba(75,192,192,1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.getHistory(unitData, 1, time),
				},
				{
					label: 'TEMP',
					fill: false,
					lineTension: 0.5,
					backgroundColor: 'rgba(175,30,10,0.6)',
					borderColor: 'rgba(175,30,10,0.6)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: this.getHistory(unitData, 2, time),
				},
			],
		};
		return myData;
	}

	onChange = (Date) => {
		this.setState({ date: Date });
		console.log(this.state.date);
	};

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

					<h1 style={{ userSelect: 'none' }}>
						ℙᚱ⊙ᶨeꓘ☂
						<Image src={ThermoMeter} width='55' height='55' />
					</h1>

					<div className='containers'>
						{this.state.DeviceData.map((unit, i) => {
							const RightClass = unit.Online ? 'containerOnline' : 'containerOffline';
							const RightClassOpen = unit.Online ? 'containerOpen' : 'containerOpenOffline';
							const classNumber = 'Class ' + unit.Name.replace(/\D/g, '');

							let dayTime = 86400000;
							let monthTime = 2629800000;
							let yearTime = 31557600000;

							//console.log(this.getHistory(unit.History, 0, monthTime))

							if (unit.Open) {
								return (
									<div key={unit.UnitID} className={RightClassOpen} onClick={() => this.setOpen(unit.UnitID)}>
										<div className='Chart'>
											<p style={{ userSelect: 'none' }} className='text'>
												{unit.Name} {unit.Online ? 'Online' : 'Offline'}
											</p>
											<Line
												data={this.getFullHistoryData(unit.History, monthTime)}
												width={300}
												height={200}
											/>
										</div>
									</div>
								);
							} else {
								return (
									<div
										id={unit.UnitID}
										key={i}
										className={RightClass}
										onClick={() => this.setOpen(unit.UnitID)}>
										<p style={{ userSelect: 'none' }} className='text'>
											{classNumber}
										</p>
										<p style={{ userSelect: 'none' }} className='text'>
											{unit.Online ? 'Online' : 'Offline'}
										</p>
										<p style={{ userSelect: 'none' }} className='text'>
											{unit.Humidity}%
										</p>
										<p style={{ userSelect: 'none' }} className='text'>
											{unit.Temperature}℃
										</p>
									</div>
								);
							}
						})}
					</div>
					<ReactPlayer url={SWIntro} playing={this.state.playing} volume={0.3} height={1} />
					<div id='DeathStar'>
						<Image src={DeathStar} width='55' height='55' onClick={() => this.play()} />
					</div>
				</div>

				{/* <div>
					<Calendar onChange={this.onChange} value={this.state.date} defaultView='decade' />
				</div> */}

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
					<Image src={SWIcon} />
				</div>
			</div>
		);
	}
}

export default App;
