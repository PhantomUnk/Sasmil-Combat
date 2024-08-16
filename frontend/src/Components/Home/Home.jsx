import axios from '../../axios'
import React, { useState, useEffect } from 'react'

import { Flex } from 'antd' // импортирую библиотеку ant design
import { SyncOutlined } from '@ant-design/icons' // иконка настроек, корзины
import { TbHandFinger } from 'react-icons/tb'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { PiBreadLight } from 'react-icons/pi'
import {
	getUserData,
	getUserBoosts,
	setBoost,
	getUserSettings,
	setUserSettings,
} from '../userInf'

import { createNotify } from '../Ui/notify'
import { MyButton } from '../Ui/MyButton'
import { MyInput } from '../Ui/MyInput'

import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { BoostZone } from './BoostZone'
import { HomeHeader } from './HomeHeader'
import { Unnamed } from '../Menu/Menu'
import { pop } from '../Particle'
import { MyTapButton } from '../Ui/MyTapButton'

const Home = () => {
	// * Здесь все useState-ы
	let body = document.getElementsByTagName('body')[0]

	const { t } = useTranslation()
	const [userData, setUserData] = useState({}) // * Данные пользователя
	const [currentMoney, setMoney] = useState(0) // * Деньги пользователя
	const [currentEnergy, setEnergy] = useState() // * Энергия пользователя
	const [getProgress, setProgressBar] = useState() // * Progress Bar

	const [maxEnergy, setMaxEnergy] = useState(0) // * Максимальная энергия пользователя
	const [ID, setID] = useState(11) // * Должна быть подключена библиотека telegram чтобы подставлять id пользователя
	const [isSetDataCalled, setIsSetDataCalled] = useState(false)
	const [isThemeSetCalled, setIsThemeSetCalled] = useState(false)
	const [getTheme, setTheme] = useState() // * Тема пользователя
	const [lang, setLang] = useState() // * Язык пользователя
	const [getVibrations, setVibrations] = useState() // * Значение для вибрации
	const [userBoosts, setUserBoosts] = useState([
		{
			name: 'MultiTap',
			time: 'infinity',
			description: 'In esse ad excepteur amet eu aliqua enim pariatur non.',
		},
	]) // * Все бусты которые есть у пользователя
	const [boosts, setBoosts] = useState([
		{
			name: 'MultiTap',
			time: 'infinity',
			description: 'In esse ad excepteur amet eu aliqua enim pariatur non.',
		},
	]) // * useStaet для бустов

	// TODO: Подключить тг
	const tg = window.Telegram.WebApp // ! Для телеграмма

	const mainStlD = {
		'--text-color': '#E8E8E8',
	}
	const mainStlL = {
		'--text-color': '#6A6A6A',
	}

	// TODO: перейти на dvh dvw
	const boxStyle = {
		// * style для Flex
		position: 'relative',
		top: '1rem',
		width: '100%',
		height: '100%',
	}

	const addClick = () => {
		navigator.vibrate(getVibrations)
		// ! функция по добавлению клика
		setMoney(s => s + userData.CPS) // прибавляем очки
		setEnergy(e => e - userData.CPS) // убавляем энергию
		axios
			.post('/click', {
				id: ID,
				money: currentMoney + userData.CPS,
				energy: currentEnergy - userData.CPS,
			})
			.then(response => {
				console.log(response.data)
			})
		setProgressBar(`${currentEnergy / (maxEnergy / 100)}%`) // устанавливаем прогресс бар в соответствии с кол-во энергии
	}

	const sendPurchase = async (name, time, price) => {
		// ! Функция для покупки буста
		const data = { id: String(ID), name: name, time: time, price: price }
		if (name === 'Full Energy') {
			// ! Проверяем название буста
			if (userData.Full_Energy) {
				// ! проверяем куплен ли
				// * если не куплен то покупаем
				createNotify('success', t('Буст куплен'), !getTheme)
				await axios.post('/boosts/buyBoost', data)
				setEnergy(maxEnergy)
				setMoney(currentMoney - price)
				getUserBoosts(ID, setUserBoosts)
				return true
			} else {
				// * если куплен говорим подождать
				console.log('no no mr Fish')
				createNotify('warn', t('2 часа не прошло'), getTheme)
				return false
			}
		} else {
			// * при ином названии буста просто покупаем его
			await axios.post('/boosts/buyBoost', data).then(response => {
				if (name === 'Energy Limit') {
					createNotify('success', t('Буст куплен'), !getTheme)
					setMaxEnergy(maxEnergy + 1000)
					setEnergy(maxEnergy + 1000)
				} else if (name === 'MultiTap') {
					createNotify('success', t('Буст куплен'), !getTheme)
					userData.CPS++
				}
			})
			setMoney(currentMoney - price)
			getUserBoosts(ID, setUserBoosts)
		}
	}

	const setData = async () => {
		if (!isSetDataCalled) {
			getUserData(ID, setUserData, setMoney, setEnergy, setMaxEnergy)
			getUserBoosts(ID, setUserBoosts)
			setBoost(setBoosts)
			getUserSettings(ID, setLang, setTheme, setVibrations)
			setIsSetDataCalled(true)
		}
	}
	const progressZone = async () => {
		setProgressBar(`${currentEnergy / (maxEnergy / 100)}%`)
	}

	const setAvailableTheme = async () => {
		if (getTheme != undefined && !isThemeSetCalled) {
			console.log(`Текущая тема - ${getTheme}`)
			body.className = `body-${getTheme}`
			setIsThemeSetCalled(true)
		}
	}

	useEffect(() => {
		i18n.changeLanguage(lang)
		setData()
		progressZone()
		setAvailableTheme()
	}, [currentEnergy, maxEnergy, getTheme])

	const [test, setTest] = useState(false)

	useEffect(() => {
		if (test) getUserData(ID, setUserData, setMoney, setEnergy, setMaxEnergy)
		else setTest(true)
	}, [userBoosts])

	const progress = {
		// * переменная для прогресс бара
		'--progress': getProgress,
		'--color': getTheme === 0 ? '#FF3F3F' : '#56B6FF',
	}

	const boostAvatars = {
		// * Объект название:аватар
		'Energy Limit': (
			<PiBreadLight
				fontSize={20}
				style={{
					marginTop: '3px',
					color:
						getTheme == 0 ? mainStlD['--text-color'] : mainStlL['--text-color'],
				}}
			/>
		),
		MultiTap: (
			<TbHandFinger
				fontSize={20}
				style={{
					marginTop: '3px',
					color:
						getTheme == 0 ? mainStlD['--text-color'] : mainStlL['--text-color'],
				}}
			/>
		),
		'Full Energy': (
			<SyncOutlined
				spin
				style={{
					color:
						getTheme == 0 ? mainStlD['--text-color'] : mainStlL['--text-color'],
				}}
			/>
		),
	}

	const fontFamily = () => {
		return lang == 'arm' ? 'Noto Sans Armenian' : 'Inter'
	}
	
	return (
		<>
			<Flex vertical={true} style={boxStyle} justify='center' align='center'>
				{/* Header */}
				<HomeHeader
					getTheme={getTheme}
					fontFamily={fontFamily}
					name={'Samik'}
				/>

				{/* <boost zone> */}
				<BoostZone
					getTheme={getTheme}
					fontFamily={fontFamily}
					t={t}
					boostAvatars={boostAvatars}
					userBoosts={userBoosts}
					setUserBoosts={setUserBoosts}
				/>

				<MyInput theme={getTheme} className='text-center bread-count'>
					<p style={{ '--font': fontFamily() }} className={`p-${getTheme}`}>
						{currentMoney.toLocaleString()}
					</p>
					<PiBreadLight
						fontWeight={'bolder'}
						fontSize={15}
						style={{
							color:
								getTheme == 0
									? mainStlD['--text-color']
									: mainStlL['--text-color'],
						}}
					/>
				</MyInput>

				<MyInput theme={getTheme} className='main-circle'>
					<MyTapButton 
						theme={getTheme}
						className={`inner-circle-${getTheme}`}
						onClick={addClick}
						click={userData.CPS}
					/>
					<div className={`energy progress-circle`} style={progress}></div>
				</MyInput>
				<p className={`energy-count font-bold text-xl p-${getTheme}`}>
					{currentEnergy}/{maxEnergy}
				</p>

				<Unnamed
					getTheme={getTheme}
					getVibrations={getVibrations}
					fontFamily={fontFamily}
					sendPurchase={sendPurchase}
					setLang={setLang}
					lang={lang}
					ID={ID}
					mainStlD={mainStlD}
					mainStlL={mainStlL}
					userData={userData}
					boosts={boosts}
					t={t}
					currentMoney={currentMoney}
					maxEnergy={maxEnergy}
					i18n={i18n}
					setTheme={setTheme}
					setUserSettings={setUserSettings}
					setVibrations={setVibrations}
				/>
			</Flex>
			<ToastContainer />
		</>
	)
}

export default Home
