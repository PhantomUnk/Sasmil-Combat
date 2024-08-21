import React from 'react'

export const P = (props) => {
   const {
      className = null | String,
      getTheme = undefined | Number,
      fontFamily = () => { return "Iter" },
   } = props

   
	return (
		<p style={{ '--font': fontFamily() }} className={`p-t-${getTheme} ${className}`}>
			{props.children}
		</p>
	)
}
