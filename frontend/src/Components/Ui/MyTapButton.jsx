import { createParticle } from '../Particle'
import { useRef } from 'react'
import React, { useState, useEffect } from 'react'

export const MyTapButton = (props) => {
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
	} = props
	const e = useRef(null)

	useEffect(() => {
		const el = e.current
		setS(el.getBoundingClientRect())
	}, [])

	const x = s.left + s.width / 2
   const y = s.top + s.height / 2
   
   function _onClick() {
      onClick()
      createParticle(x, y, click, theme)
   }
	return (
		<div
			data-text={1}
			className={`my-button-${theme} ${className}`}
			onClick={() => _onClick()}
			ref={e}
		>
			{props.children}
		</div>
	)
}
