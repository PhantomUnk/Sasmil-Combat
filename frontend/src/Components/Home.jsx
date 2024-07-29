import axios from '../axios'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal' // библиотека для модального окна

import { Flex, Card, Button } from 'antd' // импортирую библиотеку ant design
import {
	SettingOutlined,
	ShoppingCartOutlined,
	SyncOutlined,
	createFromIconfontCN,
} from '@ant-design/icons' // иконка настроек, корзины
import { TbHandFinger } from 'react-icons/tb'

import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { PiBreadLight } from 'react-icons/pi'
import IconDuck from '../Icons/duckIcon'

class ModalMethods {
	// class для модального окна
	#setOpen // private поле с setter
	#isOpen // private поле состояние окна
	constructor(setOpen, isOpen) {
		this.#setOpen = setOpen
		this.#isOpen = isOpen
	}
	openModal = () => {
		// функция для открытия окна
		this.#setOpen(true)
	}
	closeModal = () => {
		// функция для закрытия окна
		this.#setOpen(false)
	}

	isOpenM = () => {
		// получение состояния окна
		return this.#isOpen
	}
}

const Home = () => {
	// * здесь все useState-ы
	const [userData, setUserData] = useState({}) // Данные пользователя
	const [currentMoney, setMoney] = useState() // его деньги
	const [currentEnergy, setEnergy] = useState() // его энергия
	const [getProgress, setProgressBar] = useState() // progress Bar
	const [openMarket, setOpenMarket] = useState(false) // useState для модального окна магазина
	const [openSettings, setOpenSettings] = useState(false) // useState для модального окна настроек
	const [boosts, setBoosts] = useState(['start']) // useStaet для бустов
	const [maxEnergy, setMaxEnergy] = useState(0) // его максимальная энергия
	const [ID, setID] = useState(11) // ! Должна быть подключена библиотека telegram чтобы подставлять id пользователя
	// TODO: Подключить тг
	// * формулу цен (lvl * 1000 + 250) + 105% для Bread
	const tg = window.Telegram.WebApp // ! Для телеграмма
	const styleForModal = {
		// * style for Modal
		overlay: {
			backgroundColor: 'rgba(120, 120, 120, 0.36)',
			height: '100lvh',
		},
		content: {
			borderRadius: '15px',
			backgroundColor: '#F7F7F7',
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

	const createNotify = (appearance, message) => {
		// ! Функция по созданию алертиков
		// * принимает в себя вид алерта и сообщение алерта
		switch (appearance) {
			case 'success':
				return toast.success(message, {
					position: 'top-center',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
					transition: Bounce,
				})
			case 'warn':
				return toast.warn(message, {
					position: 'top-center',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
					transition: Bounce,
				})
			case 'info':
				return toast.info(message, {
					position: 'top-center',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
					transition: Bounce,
				})
			case 'err':
				return toast.error(message, {
					position: 'top-center',
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: 'light',
					transition: Bounce,
				})
			default:
				return 'Error'
		}
	}

	const addClick = () => {
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

	const setData = async () => {
		// ! Функция для получения данных с ЗАВОДА
		await axios
			.post(`/users/getUserData/${ID}`)
			.then(response => {
				// проставляем данные
				setUserData(response.data)
				setMoney(response.data.money)
				setEnergy(response.data.energy)
				setMaxEnergy(response.data.MaxEnergy)
			})
			.catch(error => console.log(error))
	}

	const setBoost = async () => {
		// ! Функция для получение бустов
		await axios.get('/boosts/getAvailableBoosts').then(response => {
			setBoosts(response.data)
		})
	}

	const sendPurchase = async (name, time, price) => {
		// ! Функция для покупки буста
		const data = { id: ID, name: name, time: time, price: price }
		if (name === 'Full Energy') {
			// ! Проверяем название буста
			if (userData.Full_Energy) {
				// ! проверяем куплен ли
				// * если не куплен то покупаем
				createNotify('success', 'Буст куплен')
				await axios.post('/boosts/buyBoost', data)
				setEnergy(maxEnergy)
				setMoney(currentMoney - price)
				setTimeout(document.location.reload(), 2000)
			} else {
				// * если куплен говорим подождать
				console.log('no no mr Fish')
				createNotify('warn', '2 часа не прошло')
			}
		} else {
			// * при ином названии буста просто покупаем его
			await axios.post('/boosts/buyBoost', data).then(response => {
				if (name === 'Energy Limit') {
					createNotify('success', 'Буст куплен')
					setMaxEnergy(maxEnergy + 1000)
				} else if (name === 'MultiTap') {
					createNotify('success', 'Буст куплен')
					userData.CPS++
				}
			})
			setMoney(currentMoney - price)
		}
	}

	const getUserBoosts = async () => {
		await axios.post(`/boosts/getUserBoosts/${ID}`).then(response => {
			console.log(response.data)
		})
	}

	// useEffect(() => {
	// 	// * Вызываем все функции 1 раз
	// 	setBoost()
	// 	setData()
	// 	getUserBoosts()
	// }, [])

	useEffect(() => {
		setProgressBar(`${currentEnergy / (maxEnergy / 100)}%`)
	})
	const progress = {
		// * переменная для прогресс бара
		'--progress': getProgress,
	}

	let marketModal = new ModalMethods(setOpenMarket, openMarket)
	let settingsModal = new ModalMethods(setOpenSettings, openSettings)

	Modal.setAppElement('#root') // ? В документации так было

	const boostAvatars = {
		// * Объект название:аватар
		'Energy Limit': <PiBreadLight fontSize={20} style={{ marginTop: '3px' }} />,
		MultiTap: <TbHandFinger fontSize={20} style={{ marginTop: '3px' }} />,
		'Full Energy': <SyncOutlined spin />,
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
	}
	const setBoostAvatar = name => {
		// ! Функция для подставки Аватаров
		return boostAvatars[name]
	}
	return (
		<>
			<Flex vertical={true} style={boxStyle} justify='center' align='center'>
				<div className='name-field text-center my-input'>
					<div className='avatar-box my-button'></div>
					<p>Usre_name</p>
				</div>
				<div className='my-input boost-zone text-center'>
					<p>Boost Zone</p>
				</div>
				<div className='my-input text-center bread-count'>
					<p>{currentMoney}</p>
					<PiBreadLight fontWeight={'bolder'} fontSize={15} />
				</div>
				<div className='main-circle my-input'>
					<button
						className='inner-circle my-button'
						onClick={() => addClick()}
					/>
					<div className='energy progress-circle' style={progress}></div>
				</div>
				<p className='energy-count font-bold text-xl'>
					{currentEnergy}/{maxEnergy}
				</p>
				<Flex
					className='navigation my-button'
					vertical={false}
					justify='space-around'
					align='center'
				>
					<ShoppingCartOutlined
						style={{ fontSize: 30, color: '#808080', fontWeight: 25 }}
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
							<div className='my-input text-center flex gap-2 px-4 py-1'>
								<p>{currentMoney}</p>
								<PiBreadLight
									fontWeight={'bolder'}
									fontSize={15}
									style={{ marginTop: '5px' }}
								/>
							</div>
							{boosts.map(boost => (
								<Card
									actions={[
										<Button
											id={boost.name}
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
											{boostPrices[boost.name]} <PiBreadLight />
										</Button>,
									]}
									style={{ width: '100%', margin: '10px 0px' }}
								>
									<Card.Meta
										avatar={setBoostAvatar(boost.name)}
										title={boost.name}
									/>
									<p>{boost.description}</p>
									<p>
										Время: {boost.time === 'infinity' ? 'Навсегда' : boost.time}
									</p>
								</Card>
							))}

							<Button onClick={() => marketModal.closeModal()}>Close</Button>
						</Flex>
					</Modal>
					<img
						src={process.env.PUBLIC_URL + '/duck.svg'}
						width={"35em"}
						alt='duck'
						onClick={() => createNotify("info", "Скоро будет доступно")}
						/>
					<SettingOutlined
						style={{ fontSize: 25, color: '#808080' }}
						onClick={() => settingsModal.openModal()}
					/>
					<Modal
						isOpen={settingsModal.isOpenM()}
						onRequestClose={settingsModal.closeModal}
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
							<Button onClick={() => settingsModal.closeModal()}>Close</Button>
						</Flex>
					</Modal>
				</Flex>
			</Flex>
			<ToastContainer
				position='top-center'
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
				transition={Bounce}
			/>
		</>
	)
}

export default Home
