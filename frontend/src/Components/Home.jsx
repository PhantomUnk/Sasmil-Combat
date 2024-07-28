import axios from '../axios'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal' // библиотека для модального окна

import { Flex, Card, Button } from 'antd' // импортирую библиотеку ant design
import {
	SettingOutlined,
	ShoppingCartOutlined,
	SyncOutlined,
} from '@ant-design/icons' // иконка настроек, корзины

import { TbHandFinger } from 'react-icons/tb'

import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { PiBreadLight } from 'react-icons/pi'
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
	const [currentMoney, setScore] = useState() // его деньги
	const [currentEnergy, setEnergy] = useState() // его энергия
	const [getProgress, setProgressBar] = useState() // progress Bar
	const [openModal, setOpenModal] = useState(false) // useState для модального окна
	const [boosts, setBoosts] = useState(['start']) // useStaet для бустов
	const [maxEnergy, setMaxEnergy] = useState(0) // его максимальная энергия
	const [ID, setID] = useState(11) // ! Должна быть подключена библиотека telegram чтобы подставлять id пользователя
	// TODO: Подключить тг
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

	const notify = () => {
		toast.success('Буст куплен', {
			position: 'top-center',
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			theme: 'light',
			transition: Bounce,
		})
	}
	const addClick = () => {
		// ! функция по добавлению клика
		setScore(s => s + 1) // прибавляем очки
		setEnergy(e => e - 1) // убавляем энергию
		axios
			.post('/click', {
				id: 11,
				money: currentMoney + 1,
				energy: currentEnergy - 1,
			})
			.then(response => {
				console.log(response.data)
			})
		setProgressBar(`${currentEnergy / (maxEnergy / 100)}%`) // устанавливаем прогресс бар в соответствии с кол-во энергии
	}

	const setData = async () => {
		// ! Функция для получения данных с ЗАВОДА
		await axios
			.post('/users/getUserData/11')
			.then(response => {
				// проставляем данные
				setUserData(response.data)
				setScore(response.data.money)
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
		await axios.post('/boosts/buyBoost', data).then(response => {})
		setScore(s => s - price)
	}

	useEffect(() => {
		// * Вызываем все функции 1 раз
		setBoost()
		setData()
	}, [])

	useEffect(() => {
		setProgressBar(`${currentEnergy / (maxEnergy / 100)}%`)
	})
	const progress = {
		// * переменная для прогресс бара
		'--progress': getProgress,
	}

	let modal = new ModalMethods(setOpenModal, openModal)
	Modal.setAppElement('#root') // ? В документации так было

	const boostAvatars = {
		// * Объект название:аватар
		Bread: <PiBreadLight fontSize={20} style={{ marginTop: '3px' }} />,
		MultiTap: <TbHandFinger fontSize={20} style={{ marginTop: '3px' }} />,
		FullBread: <SyncOutlined spin />,
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
						onClick={() => modal.openModal()}
					/>
					<Modal
						isOpen={modal.isOpenM()}
						onRequestClose={modal.closeModal}
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
							{boosts.map(boost => (
								<Card
									actions={[
										<Button
											type='primary'
											onClick={
												() => {
													sendPurchase(boost.name, boost.time, boost.price);
													notify()
												}
											}
											disabled={boost.price > currentMoney ? true : false}
										>
											{boost.price} <PiBreadLight />
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

							<button onClick={() => modal.closeModal()}>close</button>
						</Flex>
					</Modal>
					<SettingOutlined style={{ fontSize: 25, color: '#808080' }} />
				</Flex>
			</Flex>
			<ToastContainer
				position="top-center"
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
		</>
	)
}

export default Home
