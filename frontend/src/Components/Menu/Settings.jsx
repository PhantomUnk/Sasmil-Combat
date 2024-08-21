import Modal from 'react-modal'
import { Flex, Button, Switch, ConfigProvider, Select } from 'antd'
import { MyInput } from '../Ui/MyInput'
import { createNotify } from '../Ui/notify'
import { StarFilled, MoonFilled } from '@ant-design/icons'
import { P } from '../Ui/P'

export const Settings = ({
	getTheme,
	settingsModal,
	styleForModal,
	fontFamily,
	t,
	lang,
	setLang,
	i18n,
	setUserSettings,
	ID,
	getVibrations,
	setVibrations,
	setTheme,
}) => {
	let body = document.getElementsByTagName('body')[0]
	const Theme = theme => {
		try {
			setTheme(theme == false ? 0 : 1)
			createNotify(
				'success',
				t(`Вы поменяли тему на ${theme == false ? 'тёмную' : 'светлую'}`),
				getTheme
			)
			body.className = `body-${theme == false ? 0 : 1}`
			setUserSettings(ID, lang, theme == false ? 0 : 1, getVibrations)
		} catch (error) {
			console.log(error)
			createNotify('err', t('Что-то пошло не так'), getTheme)
		}
	}

	const Vibration = vibration => {
		try {
			setVibrations(vibration)
			createNotify(
				'success',
				t(`Вибрация ${vibration == 0 ? 'выключена' : 'включена'}`),
				!getTheme
			)
			setUserSettings(ID, lang, getTheme, vibration)
		} catch (error) {
			console.log(error)
			createNotify('err', t('Что-то пошло не так'), !getTheme)
		}
	}

	return (
		<Modal
			isOpen={settingsModal.isOpenM()}
			onRequestClose={settingsModal.closeModal}
			style={styleForModal}
			closeTimeoutMS={200}
		>
			<Flex
				vertical={true}
				justify='space-between'
				align='center'
				wrap={false}
				style={{
					width: '100%',
					height: '100%',
				}}
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
					<h1 style={{ '--font': fontFamily() }} className={`p-t-${getTheme} font-bold text-xl`}>
						{t('Настройки')}
					</h1>
					<MyInput
						theme={getTheme}
						className='language flex w-full h-12 justify-around items-center'
					>
						<P fontFamily={fontFamily} getTheme={getTheme}>
							{t('Поменять язык:')}
						</P>
						<ConfigProvider
							theme={{
								components: {
									Select: {
										colorBgContainer:
											getTheme == 0 ? 'rgb(0, 0, 0)' : '#FFFFFF',
										colorText: getTheme == 0 ? '#E8E8E8' : '',
										colorBgElevated: getTheme == 0 ? 'rgb(0, 0, 0)' : '#FFFFFF	',
										colorPrimary: getTheme == 0 ? 'rgb(0, 0, 0)' : '',
										colorPrimaryHover: getTheme == 0 ? 'rgb(75,75,75)' : '',
										optionSelectedBg: getTheme == 0 ? 'rgb(75,75,75)' : '',
										colorTextPlaceholder: getTheme == 0 ? 'rgb(75,75,75)' : '',
										colorTextQuaternary: getTheme == 0 ? '#FFFFFF' : '',
									},
								},
							}}
						>
							<Select
								style={{
									width: '38%',
								}}
								defaultValue={lang}
								options={[
									{ value: 'ru', label: 'Русский' },
									{ value: 'en', label: 'English' },
									{ value: 'arm', label: 'Հայերեն' },
								]}
								onChange={value => {
									setLang(value)
									i18n.changeLanguage(value)
									setUserSettings(ID, value, getTheme, getVibrations)
								}}
							/>
						</ConfigProvider>
					</MyInput>
					<MyInput
						theme={getTheme}
						className='theme_switch flex w-full h-12 justify-around items-center'
					>
						<P fontFamily={fontFamily} getTheme={getTheme}>
							{t('Поменять тему:')}
						</P>
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
						<P fontFamily={fontFamily} className={`mr-2`} getTheme={getTheme}>
							{t('Вибрация')}
						</P>
						<Switch
							defaultChecked={getVibrations == 0 ? false : true}
							onChange={() => {
								Vibration(getVibrations == 0 ? 10 : 0)
							}}
						/>
					</div>
				</Flex>
				<Button
					onClick={() => settingsModal.closeModal()}
					style={{
						'--font': fontFamily(),
						backgroundColor: getTheme == 0 ? '#151515' : '',
						borderColor: getTheme == 0 ? '#393939' : '',
						color: getTheme == 0 ? '#E8E8E8' : '',
					}}
				>
					{t('Закрыть')}
				</Button>
			</Flex>
		</Modal>
	)
}
