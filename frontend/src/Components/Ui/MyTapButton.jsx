import { createParticle } from '../Particle'
import { useRef } from 'react'
import React, { useState, useEffect } from 'react'

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
	} = props
	const e = useRef(null)

	useEffect(() => {
		const el = e.current
		setS(el.getBoundingClientRect())
	}, [])

	const x = s.left + s.width / 2
	const y = s.top + s.height / 2

	const [dis, setDis] = useState(false)
	useEffect(() => {
		setDis(currentEnergy < CPS ? true : false)
	}, [currentEnergy])
	return (
		<button
			disabled={dis}
			data-text={1}
			className={`my-button-${theme} ${className}`}
			ref={e}
			
			onTouchStart={event => {
				const touches = event.touches.length
				console.log(`Количество касаний: ${touches}`)
				// Обработка каждого касания

				if (dis == false && currentEnergy > CPS) {
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
			{props.children}
		</button>
	)
}
