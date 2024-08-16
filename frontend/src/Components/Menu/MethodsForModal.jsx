export class ModalMethods {
	// * class для модального окна
	#setOpen //! private поле с setter
	#isOpen //! private поле состояние окна
	constructor(setOpen, isOpen) {
		this.#setOpen = setOpen
		this.#isOpen = isOpen
	}
	openModal = () => {
		// * функция для открытия окна
		this.#setOpen(true)
	}
	closeModal = () => {
		// * функция для закрытия окна
		this.#setOpen(false)
	}

	isOpenM = () => {
		// * получение состояния окна
		return this.#isOpen
	}
}
