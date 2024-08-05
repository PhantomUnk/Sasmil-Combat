/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			inset: {
				'3.3px': '3.3px',
				'15': '60px',
			},
		},
	},
	plugins: [],
}
