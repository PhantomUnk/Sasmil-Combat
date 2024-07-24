import axios from "../axios";
import React, { useState, useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu"; // иконка корзины
import { RiSettings4Line } from "react-icons/ri"; // иконка настроек
import Modal from 'react-modal'; // библиотека для модального окна

import { Flex } from 'antd'; // импортирую библиотеку ant design


class ModalMethods{ // class для модального окна
    #setOpen // private поле с setter
    #isOpen // private поле сосотояние окна
    constructor(setOpen, isOpen) { 
        this.#setOpen = setOpen;
        this.#isOpen = isOpen;
    }
    openModal = () => { // функция для открытия окна
        this.#setOpen(true);
    }
    closeModal = () => { // функция для закрытия окна
        this.#setOpen(false);
    }

    isOpenM = () => { // получение состояния окна
        return this.#isOpen
    }
}

const Home = () => {
    const [userData, setUserData] = useState({}); // Данные пользователя
    const [currentMoney, setScore] = useState(); // его деньги
    const [currentEnergy, setEnergy] = useState(); // его энергмя
    const [getProgress, setProgress] = useState(); // progress Bar
    const [openModal1, setOpenModal1] = useState(false); // useState для модального окна

    const boxStyle = { // style для Flex
        position: "relative",
        top: "1rem",
        width: '100%',
        height: '100%',
    };
    const addClick = () => {
        setScore((s) => s + 1); // прибавляем очки
        setEnergy((e) => e - 1); // убавляем энергию
        axios.post('/click', {id:11,money: currentMoney + 1, energy: currentEnergy - 1, }).then((response) => {
            console.log(response.data);
        })
        setProgress(`${currentEnergy/(userData.MaxEnergy/100)}%`) // устанавливаем прогресс бар в соответсвии с кол-во энергии
    }
    const styleForModal = { // style for Flex
        overlay: {
            backgroundColor: "rgba(120, 120, 120, 0.36)",
            height: "100lvh",
        },
        content:{
            borderRadius: "15px",
        }
    }
    const setData = async () => { // Функция для получения дванных с ЗАВОДА
        await axios
            .post('/users/getUserData', 11)
            .then((response) => {
                // проставляем данные
                setUserData(response.data);
                setScore(response.data.money);
                setEnergy(response.data.energy);
        })
            .catch((error) => console.log(error));
            console.log(userData);
    }
    
    useEffect(() => {
        setProgress(`${currentEnergy/(userData.MaxEnergy/100)}%`) // устанавливаем прогресс бар в соответсвии с кол-во энергии
        setData();
    }, [])
    
    const progress = {
        '--progress': getProgress
    }
    let modal1 = new ModalMethods(setOpenModal1, openModal1)
    Modal.setAppElement('#root');
    return(
        <>
            <Flex vertical={true} style={boxStyle} justify='center' align='center'>
                <div className="nameField text-center my-input">
                    <div className="avatarBox my-button"></div>
                    <p>Usre_name</p>
                </div>
                <div className="my-input boost-zone text-center">
                    <p>Boost Zone</p>
                </div>
                <div className="my-input text-center bread-count">
                    <p>{currentMoney}</p>
                </div>
                <div className="main-circle my-input">
                    <button className="inner-circle my-button" onClick={() => addClick()} />
                    <div className="energy progress-circle" style={progress}></div>
                </div>
                <p className="energy-count font-bold text-xl">{currentEnergy}/1000</p>
                <Flex className="navigation my-button" vertical={false} justify='space-around' align='center'>
                    <LuShoppingCart fontSize={30} color="#808080" onClick={() => modal1.openModal()}/>
                    <Modal isOpen={modal1.isOpenM()} onRequestClose={modal1.closeModal} style={styleForModal}>
                        <Flex
                                vertical={false} 
                                justify='space-around' 
                                align='center' 
                                wrap={true} 
                                flex={'content'}>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button className="my-button">d</button>
                            <button onClick={() => modal1.closeModal()}>close</button>
                        </Flex>
                    </Modal>
                    <RiSettings4Line fontSize={30} color="#808080"/>
                </Flex>
            </Flex>
        </>
    )
}

export default Home