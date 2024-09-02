import { createParticle } from '../Particle'
import { useRef } from 'react'
import React, { useState, useEffect } from 'react'
import { PiBreadLight } from 'react-icons/pi'

export const MyTapButton = props => {
	const [s, setS] = useState({
		bottom: 482.734375,
		height: 172,
		left: 109,
		right: 281,
		top: 310.734375,
		width: 172,
		x: 109,
		y: 310.734375,
	})

	const {
		className = String | undefined,
		theme = Number | 1,
		onClick = undefined,
		click = Number | undefined,
		currentEnergy = Number | undefined,
		CPS = Number | undefined,
		device = Number | undefined,
	} = props
	const e = useRef(null)
	useEffect(() => {
		const el = e.current
		setS(el.getBoundingClientRect())

		console.log('device: ', device.desktop())
	}, [])

	const x = s.left + s.width / 2
	const y = s.top + s.height / 2

	const [dis, setDis] = useState(false)
	useEffect(() => {
		setDis(currentEnergy < CPS ? true : false)
	}, [currentEnergy, CPS])

	const mainStlD = {
		'--text-color': '#E8E8E8',
	}
	const mainStlL = {
		'--text-color': '#6A6A6A',
	}
	return (
		<button
			disabled={dis}
			data-text={1}
			className={`my-button-${theme} ${className}`}
			id={'tap'}
			ref={e}
			onClick={() => {
				if (dis === false && currentEnergy > CPS && device.desktop()) {
					onClick()
					createParticle(x, y, click, theme)
				} else {
					console.log('no click')
				}
			}}
			onTouchStart={event => {
				const touches = event.touches.length
				console.log(`Количество касаний: ${touches}`)
				// Обработка каждого касания

				if (dis === false && currentEnergy > CPS && device.mobile()) {
					for (let i = 0; i < touches; i++) {
						// Ваша логика для каждого касания
						onClick()
						createParticle(x, y, click, theme)
					}
				} else {
					console.log('no click')
				}
			}}
		>
			<PiBreadLight
				className='ml-7'
				fontWeight={'bolder'}
				fontSize={110}
				style={{
					color:
						theme === 0 ? mainStlD['--text-color'] : mainStlL['--text-color'],
				}}
			/>
		</button>
	)
}
