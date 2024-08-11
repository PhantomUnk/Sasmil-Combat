import { MyInput } from "../MyInput"
import { MyButton } from "../MyButton"

export const HomeHeader = ({getTheme, fontFamily, name}) => {
	return (
		<MyInput theme={getTheme} className='name-field text-center'>
			<MyButton theme={getTheme} className={'avatar-box'}></MyButton>
			<p style={{ '--font': fontFamily() }} className={`p-${getTheme}`}>
				{name}
			</p>
		</MyInput>
	)
}
