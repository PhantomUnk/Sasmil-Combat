import axios from "../axios";
import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-modal'; // библиотека для модального окна

import { Flex, Card, Button } from 'antd'; // импортирую библиотеку ant design
import { SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons'; // иконка настроек, корзины

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PiBreadLight } from "react-icons/pi";
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
    const [currentMoney, setScore] = useState(1000); // его деньги
    const [currentEnergy, setEnergy] = useState(); // его энергмя
    const [getProgress, setProgress] = useState(); // progress Bar
    const [openModal, setOpenModal] = useState(false); // useState для модального окна

    const styleForModal = { // style for Flex
        overlay: {
            backgroundColor: "rgba(120, 120, 120, 0.36)",
            height: "100lvh",
        },
        content:{
            borderRadius: "15px",
            backgroundColor: "#F7F7F7",
        }
    }

    const boxStyle = { // style для Flex
        position: "relative",
        top: "1rem",
        width: '100%',
        height: '100%',
    };

    const actions = [
        <Button type="primary">5 000 <PiBreadLight/></Button>
    ];

    const addClick = () => {
        setScore((s) => s + 1); // прибавляем очки
        setEnergy((e) => e - 1); // убавляем энергию
        axios.post('/click', {id:11,money: currentMoney + 1, energy: currentEnergy - 1, }).then((response) => {
            console.log(response.data);
        })
        setProgress(`${currentEnergy/(userData.MaxEnergy/100)}%`) // устанавливаем прогресс бар в соответсвии с кол-во энергии
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
    
    // function createCard(name){
    //     return(
    //         <Card title={name}>
    //             <p>Hello</p>
    //         </Card>
    //     )
    // }

    // useEffect(() => {
    //     setProgress(`${currentEnergy/(userData.MaxEnergy/100)}%`) // устанавливаем прогресс бар в соответсвии с кол-во энергии
    //     setData();
    // }, [])
    
    const progress = {
        '--progress': getProgress
    }
    let modal = new ModalMethods(setOpenModal, openModal)
    Modal.setAppElement('#root');

    const test = [
        {"name": "test", "description": "sasa", "price": 1000, "time": "навсегда", "logo": <PiBreadLight fontSize={20} style={{marginTop: "3px"}} />}
    ]

    const [inProp, setInProp] = useState(false);
    return(
        <>
            <Flex vertical={true} style={boxStyle} justify='center' align='center'>
                <div className="name-field text-center my-input">
                    <div className="avatar-box my-button"></div>
                    <p>Usre_name</p>
                </div>
                <div className="my-input boost-zone text-center">
                    <p>Boost Zone</p>
                </div>
                <div className="my-input text-center bread-count">
                    <p>{currentMoney}</p>
                    <PiBreadLight fontWeight={"bolder"} fontSize={15}/>
                </div>
                <div className="main-circle my-input">
                    <button className="inner-circle my-button" onClick={() => addClick()} />
                    <div className="energy progress-circle" style={progress}></div>
                </div>
                
                <p className="energy-count font-bold text-xl">{currentEnergy}/1000</p>
                <Flex className="navigation my-button" vertical={false} justify='space-around' align='center'>
                    <ShoppingCartOutlined  style={{fontSize: 30, color:"#808080", fontWeight: 25}} onClick={() => {setInProp(true); modal.openModal()}}/>
                        <Modal 
                            isOpen={modal.isOpenM()} 
                            onRequestClose={modal.closeModal} 
                            style={styleForModal}
                            closeTimeoutMS={3000}
                        >
                            <Flex
                                    vertical={false} 
                                    justify='space-around' 
                                    align='center' 
                                    wrap={true} 
                                    flex={'content'}>
                                {/* // TODO: Сделать map для всех бустов которые я буду получать с ЗАВОДА */}
                                <Card actions={actions} style={{width: "100%", margin: "10px 0px"}}>
                                    <Card.Meta
                                        avatar = {<PiBreadLight fontSize={20} style={{marginTop: "3px"}} /> }
                                        title= "Bread"
                                    />
                                    <p>Увеличивает вашу энегрию на 1000</p>
                                    <p>Время: Навсегда</p>
                                    
                                </Card>
                                {test.map(boost => (
                                    <Card actions={actions} style={{width: "100%", margin: "10px 0px"}}>
                                        <Card.Meta
                                            avatar = {boost.logo}
                                            title= {boost.name}
                                        />
                                        <p>{boost.description}</p>
                                        <p>Время: {boost.time}</p>
                                        
                                    </Card>
                                ))}
                                <button onClick={() => modal.closeModal()}>close</button>
                            </Flex>
                        </Modal>
                    <SettingOutlined  style={{fontSize: 25, color:"#808080"}}/>
                </Flex>
            </Flex>
        </>
    )
}

export default Home