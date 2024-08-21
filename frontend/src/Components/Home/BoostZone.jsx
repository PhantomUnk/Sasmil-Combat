import { MyInput } from '../Ui/MyInput'
import { MyButton } from '../Ui/MyButton'
import { Flex } from 'antd'
import { Timer } from '../Ui/Timer'
import { P } from '../Ui/P'

export const BoostZone = ({
	getTheme,
	fontFamily,
	t,
	boostAvatars,
	userBoosts,
	setUserBoosts,
}) => {
	const getBoostLvl = boostName => {
		let res = 0
		for (let i = 0; i < userBoosts.length; i++) {
			userBoosts[i].name == boostName ? (res += 1) : (res = res)
		}
		return res
	}

	const gotOuted = name => {
		setUserBoosts(userBoosts.filter(el => el.name !== name))
	}

	const table = {}
	const sortedUserBoosts = userBoosts.filter(
		({ name }) => !table[name] && (table[name] = 1)
	)

	return (
		<MyInput theme={getTheme} className='boost-zone text-center'>
			<P fontFamily={fontFamily} getTheme={getTheme}>
				{t('Зона бустов')}
			</P>
			<Flex
				vertical={false}
				justify='center'
				align='center'
				wrap={false}
				className='boost-zone-flex relative bottom-11 w-full p-2'
			>
				{sortedUserBoosts.map(userBoost => (
					<MyButton
						key={userBoost.name}
						theme={getTheme}
						className='card size-12 bg-slate-300 text-center mx-2'
					>
						<div className='inner-boost-card flex justify-center flex-col items-center'>
							{boostAvatars[userBoost.name]}
							<P fontFamily={fontFamily} getTheme={getTheme}>
								lvl {getBoostLvl(userBoost.name)}
							</P>
							{userBoost.time !== 'infinity' ? (
								<Timer
									seconds={Number(userBoost.time)}
									boostName={userBoost.name}
									gotOuted={gotOuted}
									getTheme={getTheme}
									fontFamily={fontFamily}
								/>
							) : (
								''
							)}
						</div>
					</MyButton>
				))}
			</Flex>
		</MyInput>
	)
}
