import { MyInput } from '../Ui/MyInput'
import { MyButton } from '../Ui/MyButton'
import { P } from '../Ui/P'

export const HomeHeader = ({ getTheme, fontFamily, name }) => {
	return (
		<MyInput theme={getTheme} className='name-field text-center'>
			<MyButton theme={getTheme} className={'avatar-box'} ></MyButton>
			<P fontFamily={fontFamily} getTheme={getTheme} className='p-1 pl-12'>
				{name}
			</P>
		</MyInput>
	)
}
