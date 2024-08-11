import { MyInput } from '../MyInput'
import { useState } from 'react'
import { MyButton } from '../MyButton'
import { Flex } from 'antd'
import { Timer } from '../Timer'

export const BoostZone = ({
	getTheme,
	fontFamily,
	t,
	setBoostAvatar,
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

	const [gotOut, setGotOut] = useState(false)

	const gotOuted = name => {
		setUserBoosts(userBoosts.filter(el => el.name !== name))
	}

	const table = {}
	const sortedUserBoosts = userBoosts.filter(
		({ name }) => !table[name] && (table[name] = 1)
	)

	console.log(gotOut)

	return (
		<MyInput theme={getTheme} className='boost-zone text-center'>
			<p style={{ '--font': fontFamily() }} className={`p-${getTheme}`}>
				{t('Зона бустов')}
			</p>
			<Flex
				vertical={false}
				justify='center'
				align='center'
				wrap={false}
				className='boost-zone-flex relative bottom-11 w-full'
			>
				{sortedUserBoosts.map(userBoost => (
					<MyButton
						theme={getTheme}
						className='card size-12 bg-slate-300 text-center m-2 '
					>
						<div className='inner-boost-card flex justify-center flex-col items-center'>
							{setBoostAvatar(userBoost.name)}
							<p>lvl {getBoostLvl(userBoost.name)}</p>
							{userBoost.time !== 'infinity' ? (
								<Timer
									seconds={Number(userBoost.time)}
									boostName={userBoost.name}
									gotOuted={gotOuted}
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
