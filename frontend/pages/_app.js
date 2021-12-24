
import '../styles/globals.css';
import './App.css';
import React from 'react';
import ThermoMeter from '../images/ThermoWhite.png';
import Image from 'next/image';
import Particles from 'react-particles-js';
import SWIntro from '../images/StarWars.mp3';
import DeathStar from '../images/Death-Star-SWCT.png';
import SWIcon from '../images/Star-Wars-PNG-Image-84345.png';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { particleData } from '../variables-functions/particles.js';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale)
class App extends React.Component {
	state = {
		DeviceData: [],
		playing: false,
	};

	async doEveryHour() {
		await axios.get('http://localhost:5000/api/getHistory').then((response) => {
			const WithOpensData = response.data.map(v => ({...v, Open: false}))
			this.setState({ DeviceData: WithOpensData });
		});

		console.log(this.state.DeviceData);
	}
	componentDidMount() {
		this.doEveryHour();
		this.interval = setInterval(() => this.doEveryHour(), 40000);
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
		document.getElementById('content').style.animation = 'scroller 100s linear 9s';

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
			}, 15000);
		}, 2000);

		setTimeout(function () {
			//ScrollerAfter.innerHTML = ScrollerAfter.innerHTML.replace("background: linear-gradient(transparent)");
			document.getElementById('scroller').style.width = '0px';
			document.getElementById('Main').style.transition = '2s';
			document.getElementById('Main').style.opacity = '100%';
			this.setState({ playing: false });
		}, 78500);
	}
	setOpen(id) {
		let tempData = this.state.DeviceData
		for (var i = 0; i < tempData.length; i++) {
			if (tempData[i].UnitID === id) {
				if (tempData[i].Open) {
					tempData[i].Open = false
				} else {
					tempData[i].Open = true;
				}
				this.setState({ DeviceData: tempData })
				console.log(this.state.DeviceData)
				return;
			}
		}
	}
	render() {
		const data = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
					data: [65, 59, 80, 81, 56, 55, 40]
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
					data: [25, 47, 60, 73, 86, 54, 40,]
				}
			]
		};
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
							let RightClass = unit.Online ? 'containerOnline' : 'containerOffline';
							let classNumber = 'Class ' + unit.Name.replace(/\D/g, '');

							if (unit.Open) {
								return (
									<div key={unit.UnitID} className={"containerOpen"} onClick={() => this.setOpen(unit.UnitID)}>

										<div className="Chart">
											<p style={{ userSelect: "none" }} className='text'>{unit.Name} {unit.Online ? 'Online' : 'Offline'}</p>
											<Line
												data={data}
												width={300}
												height={200}
											/>
										</div>
									</div>
								);
							} else {
								return (
									<div id={unit.UnitID} key={i} className={RightClass} onClick={() => this.setOpen(unit.UnitID)}>
										<p style={{ userSelect: 'none' }} className='text'>
											{classNumber}
										</p>
										<p style={{ userSelect: 'none' }} className='text'>
											{unit.Online ? 'Online' : 'Offline'}
										</p>
										<p style={{ userSelect: 'none' }} className='text' id='data'>
											{unit.Humidity}% H₂O
										</p>
										<p style={{ userSelect: 'none' }} className='text' id='data'>
											{unit.Temperature}℃
										</p>
									</div>
								);
							}
						})}
					</div>
					<ReactPlayer url={SWIntro} playing={this.state.playing} volume={0.3} />
					<Image src={DeathStar} width='55' height='55' onClick={() => this.play()} />
					{/*<Line
						data={data}
						width={10}
						height={10}
					/>*/}
				</div>
				<div id='scroller'>
					<div id='content'>
						<p id='title'>Episode LXI</p>
						<p id='subtitle'>Mp suomen maahanmuuttopoltiikka</p>
						<p id='contentText'>._.</p>
						<p id='contentText'>._.</p>
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