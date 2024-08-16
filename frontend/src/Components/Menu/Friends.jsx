import { Flex, Button } from 'antd'
import Modal from 'react-modal'
import { LinkButton } from '../Ui/LinkButton'
import { userLink } from '../userInf'
import { pop } from '../Particle'

export const Friends = ({
	friendsModal,
	styleForModal,
	fontFamily,
	getTheme,
	t,
	ID,
}) => {
	const setClass = () => {
		try {

			document.querySelector('.btn').classList.add('active')
			setTimeout(() => {
				document.querySelector('.btn').classList.remove('active')
			}, 2000)
		} catch (e) {
			console.log(e)
		}
	}
	return (
		<Modal
			isOpen={friendsModal.isOpenM()}
			onRequestClose={friendsModal.closeModal}
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
				className='friends'
			>
				<LinkButton
					onClick={() => setClass()}
					className={`theme-${getTheme} w-40 h-14`}
					style={{ backgroundColor: getTheme === 0 ? '#FF3F3F' : '#56B6FF' }}
				/>
				<Button
					onClick={() => friendsModal.closeModal()}
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
