import axios from '../axios'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal' // библиотека для модального окна

import { Flex, Card, Button, Switch, ConfigProvider, Select } from 'antd' // импортирую библиотеку ant design
import {
	SettingOutlined,
	ShoppingCartOutlined,
	SyncOutlined,
	StarFilled,
	MoonFilled,
} from '@ant-design/icons' // иконка настроек, корзины
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
} from './userInf'

import { createNotify } from './notify'
import { MyButton } from './MyButton'
import { MyInput } from './MyInput'

class ModalMethods {
	// * class для модального окна
	#setOpen //! private поле с setter
	#isOpen //! private поле состояние окна
	constructor(setOpen, isOpen) {
		this.#setOpen = setOpen
		this.#isOpen = isOpen
	}
	openModal = () => {
		// * функция для открытия окна
		this.#setOpen(true)
	}
	closeModal = () => {
		// * функция для закрытия окна
		this.#setOpen(false)
	}

	isOpenM = () => {
		// * получение состояния окна
		return this.#isOpen
	}
}

const Home = () => {
	// * Здесь все useState-ы
	const [userData, setUserData] = useState({}) // * Данные пользователя
	const [currentMoney, setMoney] = useState() // * Деньги пользователя
	const [currentEnergy, setEnergy] = useState() // * Энергия пользователя
	const [getProgress, setProgressBar] = useState() // * Progress Bar
	const [openMarket, setOpenMarket] = useState(false) // * состояние для модального окна магазина
	const [openSettings, setOpenSettings] = useState(false) // * состояние для модального окна настроек
	const [maxEnergy, setMaxEnergy] = useState(0) // * Максимальная энергия пользователя
	const [ID, setID] = useState(11) // * Должна быть подключена библиотека telegram чтобы подставлять id пользователя
	const [isSetDataCalled, setIsSetDataCalled] = useState(false)
	const [isThemeSetCalled, setIsThemeSetCalled] = useState(false)
	const [getTheme, setTheme] = useState() // * Тема пользователя
	const [lang, setLang] = useState() // * Язык пользователя
	const [getVibrations, setVibrations] = useState() // * Значение для вибрации
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

	const styleForModal = {
		// * style for Modal
		overlay: {
			backgroundColor: 'rgba(120, 120, 120, 0.36)',
			height: '100lvh',
		},
		content: {
			borderRadius: '15px',
			border: 'none',
			backgroundColor: getTheme === 0 ? '#181b20' : '#F7F7F7',
			height: '85lvh',
		},
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
		const data = { id: ID, name: name, time: time, price: price }
		if (name === 'Full Energy') {
			// ! Проверяем название буста
			if (userData.Full_Energy) {
				// ! проверяем куплен ли
				// * если не куплен то покупаем
				createNotify('success', 'Буст куплен', !getTheme)
				await axios.post('/boosts/buyBoost', data)
				setEnergy(maxEnergy)
				setMoney(currentMoney - price)
			} else {
				// * если куплен говорим подождать
				console.log('no no mr Fish')
				createNotify('warn', '2 часа не прошло', getTheme)
			}
		} else {
			// * при ином названии буста просто покупаем его
			await axios.post('/boosts/buyBoost', data).then(response => {
				if (name === 'Energy Limit') {
					createNotify('success', 'Буст куплен', !getTheme)
					setMaxEnergy(maxEnergy + 1000)
					setEnergy(maxEnergy + 1000)
				} else if (name === 'MultiTap') {
					createNotify('success', 'Буст куплен', !getTheme)
					userData.CPS++
				}
			})
			setMoney(currentMoney - price)
		}
	}

	const setData = async () => {
		if (!isSetDataCalled) {
			getUserData(ID, setUserData, setMoney, setEnergy, setMaxEnergy)
			getUserBoosts(ID)
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
		// * Вызываем все функции 1 раз
		setData()
		progressZone()
		setAvailableTheme()
	}, [currentEnergy, maxEnergy, getTheme])

	const progress = {
		// * переменная для прогресс бара
		'--progress': getProgress,
		'--color': getTheme === 0 ? '#FF3F3F' : '#56B6FF',
	}

	let marketModal = new ModalMethods(setOpenMarket, openMarket)
	let settingsModal = new ModalMethods(setOpenSettings, openSettings)

	Modal.setAppElement('#root') // ? В документации так было

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
	const boostPrices = {
		'Energy Limit':
			Math.floor((maxEnergy + 250 + ((maxEnergy + 250) / 100) * 105) / 100) *
			100,
		'Full Energy': 1000,
		MultiTap:
			Math.floor(
				(userData.CPS * 100 + 1000 + ((maxEnergy + 500) / 100) * 100) / 100
			) * 100,
		'Null Boost': 1,
	}
	const setBoostAvatar = name => {
		// ! Функция для подставки Аватаров
		return boostAvatars[name]
	}

	let body = document.getElementsByTagName('body')[0]
	const Theme = theme => {
		try {
			setTheme(theme == false ? 0 : 1)
			createNotify(
				'success',
				`Вы поменяли тему на ${theme == false ? 'тёмную' : 'светлую'}`,
				getTheme
			)
			body.className = `body-${theme == false ? 0 : 1}`
			setUserSettings(ID, lang, theme == false ? 0 : 1, getVibrations)
		} catch (error) {
			console.log(error)
			createNotify('err', 'Что-то пошло не так', getTheme)
		}
	}

	const Vibration = vibration => {
		try {
			setVibrations(vibration)
			createNotify(
				'success',
				`Вибрация ${vibration == 0 ? 'включена' : 'выключена' }`,
				!getTheme
			)
			setUserSettings(ID, lang, getTheme, vibration)
		} catch (error) {
			console.log(error)
			createNotify('err', 'Что-то пошло не так', !getTheme)
		}
	}
	return (
		<>
			<Flex vertical={true} style={boxStyle} justify='center' align='center'>
				<MyInput theme={getTheme} className='name-field text-center'>
					<MyButton theme={getTheme} className={'avatar-box'}></MyButton>
					<p className={`p-${getTheme}`}>Usre_name</p>
				</MyInput>
				<MyInput theme={getTheme} className='boost-zone text-center'>
					<p className={`p-${getTheme}`}>Boost Zone</p>
				</MyInput>
				<MyInput theme={getTheme} className='text-center bread-count'>
					<p className={`p-${getTheme}`}>{currentMoney}</p>
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
					<MyButton
						theme={getTheme}
						className={`inner-circle-${getTheme}`}
						onClick={() => addClick()}
					/>
					<div className={`energy progress-circle`} style={progress}></div>
				</MyInput>
				<p className={`energy-count font-bold text-xl p-${getTheme}`}>
					{currentEnergy}/{maxEnergy}
				</p>
				<Flex
					className={`navigation my-button-${getTheme}`}
					vertical={false}
					justify='space-around'
					align='center'
				>
					<ShoppingCartOutlined
						style={{ fontSize: 30, color: '#6A6A6A', fontWeight: 25 }}
						onClick={() => {
							marketModal.openModal()
						}}
					/>
					<Modal
						isOpen={marketModal.isOpenM()}
						onRequestClose={marketModal.closeModal}
						style={styleForModal}
						closeTimeoutMS={300}
					>
						<Flex
							vertical={false}
							justify='space-around'
							align='center'
							wrap={true}
							flex={'content'}
						>
							<MyInput
								theme={getTheme}
								className='text-center flex gap-2 px-4 py-1'
							>
								<p className={`p-${getTheme}`}>{currentMoney}</p>
								<PiBreadLight
									fontWeight={'bolder'}
									fontSize={15}
									style={{
										marginTop: '5px',
										color:
											getTheme == 0
												? mainStlD['--text-color']
												: mainStlL['--text-color'],
									}}
								/>
							</MyInput>
							{boosts.map(boost => (
								<ConfigProvider
									theme={{
										components: {
											Card: {
												actionsBg: getTheme == 0 ? '#2a2e35' : '',
												colorBorderSecondary:
													getTheme == 0 ? 'rgb(0, 0, 0)' : '#F0F0F0',
											},
										},
									}}
								>
									<Card
										actions={[
											<Button
												type='primary'
												onClick={() => {
													sendPurchase(
														boost.name,
														boost.time,
														boostPrices[boost.name]
													)
												}}
												disabled={
													boostPrices[boost.name] > currentMoney ? true : false
												}
											>
												<p className={`p-${getTheme}-price`}>
													{boostPrices[boost.name]}
												</p>
												<PiBreadLight
													style={{
														color: getTheme == 0 ? 'black' : '',
													}}
												/>
											</Button>,
										]}
										style={{
											width: '100%',
											margin: '10px 0px',
											backgroundColor: getTheme == 0 ? '#2a2e35' : '#FFFFFF',
											border: 'none',
										}}
									>
										<Card.Meta
											avatar={setBoostAvatar(boost.name)}
											title={<p className={`p-${getTheme}`}>{boost.name}</p>}
										/>
										<p className={`p-${getTheme}`}>{boost.description}</p>
										<p className={`p-${getTheme}`}>
											Время:{' '}
											{boost.time === 'infinity' ? 'Навсегда' : boost.time}
										</p>
									</Card>
								</ConfigProvider>
							))}

							<Button
								onClick={() => marketModal.closeModal()}
								style={{
									backgroundColor: getTheme == 0 ? '#151515' : '',
									borderColor: getTheme == 0 ? '#393939' : '',
									color: getTheme == 0 ? '#E8E8E8' : '',
								}}
							>
								Закрыть
							</Button>
						</Flex>
					</Modal>
					<img
						src={'/duck.svg'}
						width={'35em'}
						alt='duck'
						onClick={() =>
							createNotify('info', 'Скоро будет доступно', getTheme)
						}
					/>
					<SettingOutlined
						style={{ fontSize: 25, color: '#6A6A6A' }}
						onClick={() => settingsModal.openModal()}
					/>
					<Modal
						isOpen={settingsModal.isOpenM()}
						onRequestClose={settingsModal.closeModal}
						style={styleForModal}
						closeTimeoutMS={300}
					>
						<Flex
							vertical={true}
							justify='space-around'
							align='center'
							wrap={false}
							style={{
								width: '100%',
								height: '50%',
							}}
						>
							<h1 className={`p-${getTheme}`}>Настройки</h1>
							<MyInput
								theme={getTheme}
								className='language flex w-full h-12 justify-around items-center'
							>
								<p className={`p-${getTheme}`}>Поменять язык:</p>
								<ConfigProvider
									theme={{
										components: {
											Select: {
												colorBgContainer:
													getTheme == 0 ? 'rgb(0, 0, 0)' : '#FFFFFF',
												colorText: getTheme == 0 ? '#E8E8E8' : '',
												colorBgElevated:
													getTheme == 0 ? 'rgb(0, 0, 0)' : '#FFFFFF	',
												colorPrimary: getTheme == 0 ? 'rgb(0, 0, 0)' : '',
												colorPrimaryHover: getTheme == 0 ? 'rgb(75,75,75)' : '',
												optionSelectedBg: getTheme == 0 ? 'rgb(75,75,75)' : '',
												colorTextPlaceholder:
													getTheme == 0 ? 'rgb(75,75,75)' : '',
											},
										},
									}}
								>
									<Select
										defaultValue={lang}
										options={[
											{ value: 'Russian', label: 'Russian' },
											{ value: 'English', label: 'English' },
										]}
									/>
								</ConfigProvider>
							</MyInput>

							<MyInput
								theme={getTheme}
								className='theme_switch flex w-full h-12 justify-around items-center'
							>
								<p className={`p-${getTheme}`}>Поменять тему:</p>
								<Switch
									checkedChildren={
										<div className='day'>
											<div className='sun bg-yellow-200 size-3 rounded-full m-1'></div>
											<div className='rais bg-blue-300 w-5 h-2 relative right-2.5 rotate-12 bottom-1 blur-sm'></div>
											<div className='cloud relative -top-4 left-3'>
												<div className='first bg-white size-2.5 rounded-full'></div>
												<div className='second bg-white size-2.5 rounded-full relative -left-1.5 -top-1.5'></div>
												<div className='third bg-white size-2.5 rounded-full relative left-1 -top-4'></div>
											</div>
										</div>
									}
									unCheckedChildren={
										<div className='night'>
											<MoonFilled
												style={{
													fontSize: 15,
													position: 'relative',
													top: '-35px',
													left: '0.2rem',
												}}
											/>
											<StarFilled
												style={{
													fontSize: 5,
													position: 'relative',
													top: '-45px',
													left: '-1rem',
												}}
												className='star'
											/>
											<StarFilled
												style={{
													fontSize: 4,
													position: 'relative',
													top: '-42px',
													left: '-0.1rem',
												}}
												className='star'
											/>
											<StarFilled
												style={{
													fontSize: 4,
													position: 'relative',
													top: '-38px',
													left: '0.2rem',
												}}
												className='star'
											/>
										</div>
									}
									defaultChecked={getTheme}
									onChange={() => Theme(!getTheme)}
								/>
							</MyInput>

							<div className='vibration_switch flex w-6/12 h-12 justify-evenly items-center'>
								<p className={`p-${getTheme}`}>Вибрация</p>
								<Switch
									defaultChecked={getVibrations == 0 ? false : true}
									onChange={() => {
										Vibration(
											getVibrations == 0 ? 10 : 0
										)
									}}
								/>
							</div>
							<Button
								onClick={() => settingsModal.closeModal()}
								style={{
									backgroundColor: getTheme == 0 ? '#151515' : '',
									borderColor: getTheme == 0 ? '#393939' : '',
									color: getTheme == 0 ? '#E8E8E8' : '',
								}}
							>
								Закрыть
							</Button>
						</Flex>
					</Modal>
				</Flex>
			</Flex>
			<ToastContainer />
		</>
	)
}

export default Home
