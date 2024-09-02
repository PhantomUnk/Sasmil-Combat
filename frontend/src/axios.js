import axios from 'axios' // импорт библиотеки axios

// описываю базовый юрл и headers
const instance = axios.create({
	baseURL: 'https://phantomunk-sasmil-combat-a0fe.twc1.net',
	headers: {
		'ngrok-skip-browser-warning': 1231,
	},
})

export default instance

