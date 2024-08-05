import { Bounce, toast } from 'react-toastify'

export const createNotify = (
	appearance = 'success',
   message = 'default message',
   theme = 1
) => {
	// ! Функция по созданию алертиков
	// * принимает в себя вид алерта и сообщение алерта
	switch (appearance) {
		case 'success':
			return toast.success(message, {
				position: 'top-center',
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: theme == 0 ? 'light' : 'dark',
				transition: Bounce,
			})
		case 'warn':
			return toast.warn(message, {
				position: 'top-center',
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: theme == 0 ? 'dark' : 'light',
				transition: Bounce,
			})
		case 'info':
			return toast.info(message, {
				position: 'top-center',
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: theme == 0 ? 'dark' : 'light',
				transition: Bounce,
			})
		case 'err':
			return toast.error(message, {
				position: 'top-center',
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: theme == 0 ? 'dark' : 'light',
				transition: Bounce,
			})
		default:
			return 'Error'
	}
}
