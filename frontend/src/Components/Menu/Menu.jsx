import { Flex } from 'antd'
import { SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Modal from 'react-modal' // библиотека для модального окна
import { useState } from 'react'

import { createNotify } from '../Ui/notify'
import { setUserSettings } from '../userInf'

import { Market } from './Market'
import { Settings } from './Settings'
import { BsPeople } from 'react-icons/bs'
import { ModalMethods } from './MethodsForModal'
import { Friends } from './Friends'

export const Menu = ({
	getTheme,
	mainStlD,
	mainStlL,
	maxEnergy,
	userData,
	fontFamily,
	currentMoney,
	boosts,
	sendPurchase,
	t,
	lang,
	setLang,
	ID,
	getVibrations,
	i18n,
	setVibrations,
	setTheme,
	link,
	setLink,
	friends,
}) => {
	const [openSettings, setOpenSettings] = useState(false) // * состояние для модального окна настроек
	const [openMarket, setOpenMarket] = useState(false) // * состояние для модального окна магазина
	const [openFriends, setOpenFriends] = useState(false) // * состояние для модального окна друзей

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

	let settingsModal = new ModalMethods(setOpenSettings, openSettings)
	let marketModal = new ModalMethods(setOpenMarket, openMarket)
	let friendsModal = new ModalMethods(setOpenFriends, openFriends)

	Modal.setAppElement('#root') // ? В документации так было

	return (
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

			{/* Магазин Бустов */}
			<Market
				getTheme={getTheme}
				fontFamily={fontFamily}
				t={t}
				mainStlD={mainStlD}
				mainStlL={mainStlL}
				ModalMethods={ModalMethods}
				styleForModal={styleForModal}
				boosts={boosts}
				maxEnergy={maxEnergy}
				userData={userData}
				currentMoney={currentMoney}
				sendPurchase={sendPurchase}
				marketModal={marketModal}
			/>

			<BsPeople
				style={{ fontSize: 25, color: '#6A6A6A' }}
				onClick={() => friendsModal.openModal()}
			/>

			<Friends
				styleForModal={styleForModal}
				getTheme={getTheme}
				friendsModal={friendsModal}
				fontFamily={fontFamily}
				t={t}
				link={link}
				setLink={setLink}
				ID={ID}
				friends={friends}
			/>

			<img
				src={'/duck.svg'}
				width={'35em'}
				alt='duck'
				onClick={() =>
					createNotify('info', t('Скоро будет доступно'), getTheme)
				}
			/>
			<SettingOutlined
				style={{ fontSize: 25, color: '#6A6A6A' }}
				onClick={() => settingsModal.openModal()}
			/>

			<Settings
				setLang={setLang}
				setUserSettings={setUserSettings}
				settingsModal={settingsModal}
				styleForModal={styleForModal}
				fontFamily={fontFamily}
				t={t}
				i18n={i18n}
				lang={lang}
				ID={ID}
				getVibrations={getVibrations}
				setVibrations={setVibrations}
				getTheme={getTheme}
				setTheme={setTheme}
			/>
		</Flex>
	)
}
