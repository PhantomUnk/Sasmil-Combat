import axios from 'axios' // импорт библиотеки axios

// описываю базовый юрл и headers
const instance = axios.create({
	baseURL: 'https://d6fd-176-214-112-179.ngrok-free.app',
	headers: {
		'ngrok-skip-browser-warning': 1231,
	},
})

export default instance
