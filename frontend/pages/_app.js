/** @format */

import '../styles/globals.css';
import './_app.css';
import React from 'react';
import ThermoMeter from '../images/ThermoWhite.png';
import Image from 'next/image';
import Particles from 'react-particles-js';
import SWIntro from '../images/StarWars.mp3';
import DeathStar from '../images/Death-Star-SWCT.png';
import SWIcon from '../images/Star-Wars-PNG-Image-84345.png';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';

class App extends React.Component {
	state = {
		DeviceData: [],
	};

	//fethes all device units and their history from backend
	doEveryHour() {
		axios.get('http://localhost:5000/api/getHistory').then((response) => {
			console.log(response.data);
			this.setState({ DeviceData: response.data });
			console.log(this.state.DeviceData);
		});
	}

	componentDidMount() {
		this.doEveryHour();
		this.interval = setInterval(() => this.doEveryHour(), 40000);
	}

	//star wars intro easter egg
	play() {
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
			}, 15000);
		}, 2000);

		setTimeout(function () {
			//ScrollerAfter.innerHTML = ScrollerAfter.innerHTML.replace("background: linear-gradient(transparent)");
			document.getElementById('scroller').style.width = '0px';
			document.getElementById('Main').style.transition = '2s';
			document.getElementById('Main').style.opacity = '100%';
		}, 78500);
	}

	render() {
		return (
			<div id='App' className='App'>
				<Particles
					params={{
						particles: {
							number: {
								value: 150,
								density: {
									enable: true,
									value_area: 500,
								},
							},
							color: {
								value: '#ffffff',
							},
							shape: {
								type: 'circle',
								stroke: {
									width: 0,
									color: '#000000',
								},
								polygon: {
									nb_sides: 5,
								},
								image: {
									src: 'img/github.svg',
									width: 100,
									height: 100,
								},
							},
							opacity: {
								value: 0.5,
								random: true,
								anim: {
									enable: true,
									speed: 0.1,
									opacity_min: 0.2,
									sync: false,
								},
							},
							size: {
								value: 1,
								random: true,
								anim: {
									enable: true,
									speed: 1,
									size_min: 0.5,
									sync: false,
								},
							},
							line_linked: {
								enable: false,
								distance: 150,
								color: '#ffffff',
								opacity: 0.4,
								width: 1,
							},
							move: {
								enable: true,
								speed: 0.1,
								direction: 'none',
								random: false,
								straight: false,
								out_mode: 'out',
								bounce: false,
								attract: {
									enable: false,
									rotateX: 600,
									rotateY: 1200,
								},
							},
						},
						interactivity: {
							detect_on: 'canvas',
							events: {
								onhover: {
									enable: false,
									mode: 'grab',
								},
								onclick: {
									enable: true,
									mode: 'push',
								},
								resize: true,
							},
							modes: {
								grab: {
									distance: 140,
									line_linked: {
										opacity: 1,
									},
								},
								bubble: {
									distance: 400,
									size: 40,
									duration: 2,
									opacity: 8,
									speed: 3,
								},
								repulse: {
									distance: 200,
									duration: 0.4,
								},
								push: {
									particles_nb: 4,
								},
								remove: {
									particles_nb: 2,
								},
							},
						},
						retina_detect: true,
					}}
					id='bg'
				/>
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
							return (
								<div key={i} className={RightClass}>
									<p style={{ userSelect: 'none' }} className='text'>
										{unit.Name}
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
						})}
					</div>
					<AudioPlayer
						src={(require = SWIntro)}
						onPlay={(e) => this.play()}
						onPlayError={(e) => console.log('NOT WORK')}
						volume={0.01}
					/>
					<Image src={DeathStar} width='55' height='55' />
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
