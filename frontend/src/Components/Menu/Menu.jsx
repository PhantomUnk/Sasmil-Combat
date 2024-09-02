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
import { P } from '../Ui/P'

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
			<div
				className='flex flex-col items-center'
				onClick={() => {
					marketModal.openModal()
				}}
			>
				<ShoppingCartOutlined
					style={{ fontSize: 30, color: '#6A6A6A', fontWeight: 25 }}
				/>
				<P getTheme={getTheme} fontFamily={fontFamily} className='text-sm'>
					{t('Магазин')}
				</P>
			</div>

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
			<div
				className='flex flex-col items-center'
				onClick={() => friendsModal.openModal()}
			>
				<BsPeople style={{ fontSize: 25, color: '#6A6A6A' }} />
				<P getTheme={getTheme} fontFamily={fontFamily} className='text-sm'>
					{t('Друзья')}
				</P>
			</div>
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
			<div
				className='flex flex-col items-center'
				onClick={() =>
					createNotify('info', t('Скоро будет доступно'), getTheme)
				}
			>
				<img src={'/duck.svg'} width={'28em'} alt='duck' />
				<P getTheme={getTheme} fontFamily={fontFamily} className='text-sm'>
					{t('Утка')}
				</P>
			</div>

			<div
				className='flex flex-col items-center'
				onClick={() => settingsModal.openModal()}
			>
				<SettingOutlined style={{ fontSize: 25, color: '#6A6A6A' }} />
				<P getTheme={getTheme} fontFamily={fontFamily} className='text-sm'>
					{t('Настройки')}
				</P>
			</div>
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
