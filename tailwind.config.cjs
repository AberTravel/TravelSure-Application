module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './public/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', 'sans-serif']
			},
			spacing: {
				'15/16': '93.75%',
				'13/32': '40.625%',
				112: '28rem',
				192: '48rem'
			},
			screens: {
				'2xs': '421px',
				xs: '481px',
				sm: '640px',
				md: '768px',
				lg2xl: '1023px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px',
				'3xl': '1920px'
			}
		}
	},
	daisyui: {
		themes: [
			{
				aberTravelDark: {
					background: '#292929',
					primary: '#3D3D3D',
					'primary-content': '#C7E2FF',
					secondary: '#1F1F1F',
					'secondary-content': '#C7E2FF',
					accent: '#5C5C5C',
					'accent-content': '#678FDE'
				}
			},
			{
				aberTravelLight: {
					background: '#F5F5F5',
					primary: '#B8B8B8',
					'primary-content': '#2d3d4e',
					secondary: '#cccccc',
					'secondary-content': '#2d3d4e',
					accent: '#9B9B9B',
					'accent-content': '#33476f'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
