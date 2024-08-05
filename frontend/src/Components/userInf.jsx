import axios from '../axios'

export const getUserData = async (
	ID,
	setUserData,
	setMoney,
	setEnergy,
	setMaxEnergy
) => {
	// * Функция для получения данных с БазыДанных *
	await axios
		.post(`/users/getUserData/${ID}`)
		.then(response => {
			// проставляем данные
			setUserData(response.data)
			setMoney(response.data.money)
			setEnergy(response.data.energy)
			setMaxEnergy(response.data.MaxEnergy)
		})
		.catch(error => {
			return error
		})
}

export const getUserBoosts = async ID => {
	// * Функция получения бустов которые есть у пользователя *
	await axios.post(`/boosts/getUserBoosts/${ID}`).then(response => {
		return response
	})
}

export const setBoost = async setBoosts => {
	// * Функция для получение всех существующих бустов *
	await axios.get('/boosts/getAvailableBoosts').then(response => {
		setBoosts(response.data)
	})
}

export const getUserSettings = async (ID, setLang, setTheme) => {
	// * Функция для получения настроек пользователя *
	await axios.post(`/users/getUserSettings/${ID}`).then(response => {
		setLang(response.data.language)
		setTheme(response.data.theme)
	})
}

export const setUserSettings = async (ID, lang, getTheme) => {
	// * Функция бля отправки custom ных настроек определённого пользователя *
	const data = { id: ID, language: lang, theme: getTheme }
	await axios.post(`/users/setUserSettings/`, data).then(response => {
		return response
	})
}
