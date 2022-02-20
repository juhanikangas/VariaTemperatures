/** @format */

export const particleData = {
	particles: {
		number: {
			value: 20,
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
				nb_sides: 1,
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
	retina_detect: true,
};
