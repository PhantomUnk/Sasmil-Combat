import { Flex, Button } from 'antd'
import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import { PiBreadLight } from 'react-icons/pi'

//? Requests
import { userLink } from '../userInf'

//? UI Components
import { LinkButton } from '../Ui/LinkButton'
import { P } from '../Ui/P'
import { MyButton } from '../Ui/MyButton'
import { createNotify } from '../Ui/notify'

export const Friends = ({
	friendsModal,
	styleForModal,
	fontFamily,
	getTheme,
	t,
	link,
	setLink,
	ID,
	friends,
}) => {
	const [text, setText] = useState()

	useEffect(() => {
		link == true ? setText(`https://t.me/ajhdjs_bot?start=${ID}`) : setText('')
	}, [link])

	function play() {
		setTimeout(function () {
			var title = `https://t.me/ajhdjs_bot?start=${ID}`
			var random = ''
			var possible = '-+*/|}{[]~\\":;?/.><=+-_)(*&^%$#@!)}'

			function generateRandomTitle(i, random) {
				setTimeout(function () {
					setText(random)
				}, i * 70)
			}

			for (var i = 0; i < title.length + 1; i++) {
				random = title.substr(0, i)
				for (var j = i; j < title.length; j++) {
					random += possible.charAt(Math.floor(Math.random() * possible.length))
				}
				generateRandomTitle(i, random)
				random = ''
			}
		}, 500)
		setText(`https://t.me/ajhdjs_bot?start=${ID}`)
	}

	const unsecuredCopyToClipboard = text => {
		const textArea = document.createElement('textarea')
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		try {
			document.execCommand('copy')
		} catch (err) {
			console.error('Unable to copy to clipboard', err)
		}
		document.body.removeChild(textArea)
	}

	const copyToClipboard = content => {
		if (window.isSecureContext && navigator.clipboard) {
			navigator.clipboard.writeText(content)
		} else {
			unsecuredCopyToClipboard(content)
		}
	}
	const setClass = () => {
		if (!link) {
			setLink(false) // Зашита от меня
			userLink(ID, false, setLink)
			play()
		}
		createNotify('success', t('Скопировано'), !getTheme)

		copyToClipboard(`https://t.me/ajhdjs_bot?start=${ID}`)
		document.querySelector('.btn').classList.add('active')
		setTimeout(() => {
			if (!document.querySelector('.btn')) return
			document.querySelector('.btn').classList.remove('active')
		}, 1500)
	}
	return (
		<Modal
			isOpen={friendsModal.isOpenM()}
			onRequestClose={friendsModal.closeModal}
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
				className='friends'
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
					<h1
						style={{ '--font': fontFamily() }}
						className={`p-t-${getTheme} font-bold text-xl mt-1 mb-1`}
					>
						{t('Пригласить друзей!')}
					</h1>
					<LinkButton
						onClick={() => setClass()}
						className={`theme-${getTheme} p-3 h-14 flex mt-1 mb-1`}
						style={{ backgroundColor: '#464646' }}
						text={link == true ? 'Скопировать' : t('Сгенерировать ссылку')}
					/>
					<P
						getTheme={getTheme}
						className={
							link == true ? `my-button-${getTheme} p-4 linkPar mt-1 mb-1` : ''
						}
					>
						{text}
					</P>

					{/* //*|-----------------------------------------|
					//*|------------ Friends Zone ----------------|
					//*|-----------------------------------------| */}
					<h1
						style={{
							color: getTheme == 0 ? '#E8E8E8' : '#6A6A6A',
							fontWeight: 'bold',
						}}
						className={`p-t-${getTheme} mt-1 mb-1`}
					>
						{t('Ваши друзья')}
					</h1>
					{friends.map(friend => (
						<MyButton theme={getTheme} className=' p-1 mt-1 mb-1'>
							<Flex
								vertical
								style={{
									width: '100%',
									height: '100%',
								}}
								justify='center'
								align='flex-start'
							>
								<Flex
									style={{
										width: '100%',
										height: '100%',
									}}
									justify='center'
									align='center'
								>
									<MyButton getTheme={getTheme} className=''></MyButton>
									<P
										fontFamily={fontFamily}
										getTheme={getTheme}
										className=' mx-1 text-sm font-bold'
									>
										{friend.userFirstname} {friend.userLastname}
									</P>
									<PiBreadLight
										className=' mx-1 mt-4  font-bold'
										fontSize={25}
										style={{
											color: getTheme == 0 ? '#E8E8E8' : '#6A6A6A',
										}}
									/>
									<P getTheme={getTheme} className=' mx-1 mt-4 font-bold'>
										+{friend.money / 1000}к
									</P>
								</Flex>
								<P
									fontFamily={fontFamily}
									getTheme={getTheme}
									className=' text-xs ml-1'
								>
									{friend.registerDay} {t(friend.registerMonth)}
								</P>
							</Flex>
						</MyButton>
					))}
				</Flex>
				<Button
					onClick={() => friendsModal.closeModal()}
					style={{
						'--font': fontFamily(),
						backgroundColor: getTheme == 0 ? '#151515' : '',
						borderColor: getTheme == 0 ? '#393939' : '',
						color: getTheme == 0 ? '#E8E8E8' : '',
					}}
					className='mt-3'
				>
					{t('Закрыть')}
				</Button>
			</Flex>
		</Modal>
	)
}
