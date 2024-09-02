import { SyncOutlined } from '@ant-design/icons'
import { PiBreadLight } from 'react-icons/pi'
import { TbHandFinger } from 'react-icons/tb'
import { Card, Flex, Button, ConfigProvider } from 'antd'
import Modal from 'react-modal'
import { MyInput } from '../Ui/MyInput'
import { P } from '../Ui/P'

export const Market = ({
	styleForModal,
	getTheme,
	mainStlD,
	mainStlL,
	boosts,
	fontFamily,
	t,
	maxEnergy,
	userData,
	currentMoney,
	sendPurchase,
	marketModal,
}) => {
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


	return (
		<Modal
			isOpen={marketModal.isOpenM()}
			onRequestClose={marketModal.closeModal}
			style={styleForModal}
			closeTimeoutMS={200}
		>
			<Flex
				vertical={false}
				justify='space-around'
				align='center'
				wrap={true}
				flex={'content'}
			>
				<MyInput theme={getTheme} className='text-center flex gap-2 px-4 py-1'>
					<P fontFamily={fontFamily} getTheme={getTheme}>
						{currentMoney.toLocaleString()}
					</P>
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
									<p
										style={{ '--font': fontFamily() }}
										className={`p-t-${getTheme} price ${
											boostPrices[boost.name] > currentMoney
												? 'disable'
												: 'enable'
										}`}
									>
										{boostPrices[boost.name]}
									</p>
									<PiBreadLight
										style={{
											color: getTheme == 0 ? mainStlD['--text-color'] : '',
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
								avatar={boostAvatars[boost.name]}
								title={
									<P fontFamily={fontFamily} getTheme={getTheme}>
										{boost.name}
									</P>
								}
							/>
							<P fontFamily={fontFamily} getTheme={getTheme}>
								{t(boost.description)}
							</P>
							<P fontFamily={fontFamily} getTheme={getTheme}>
								{t('Время')}: {t(boost.time)}
							</P>
						</Card>
					</ConfigProvider>
				))}

				<Button
					onClick={() => marketModal.closeModal()}
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
