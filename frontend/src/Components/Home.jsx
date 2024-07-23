import axios from "../axios";
import React, { useState, useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { RiSettings4Line } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";

import { Flex } from 'antd';

const Home = () => {
    const [userData, setUserData] = useState({}); // Данные пользователя которые ты потом будешь исользовать
    const [currentMoney, setScore] = useState(); // его бабки
    const [currentEnergy, setEnergy] = useState(); // его энергмя
    const [getProgress, setProgress] = useState(); // progress Bar 
    const boxStyle = {
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
        setProgress(`${currentEnergy/10}%`)
    }
    const setData = async () => {
        await axios
            .post('/users/getUserData', 11)
            .then((response) => {
                // проставляем данные
                setUserData(response.data);
                setScore(response.data.money);
                setEnergy(response.data.energy);
        })
            .catch((error) => console.log(error));
            setProgress(`${currentEnergy/10}%`)
    }
    
    useEffect(() => {
        setData();
    }, [])
    
    const progress = {
        '--progress': getProgress
    }
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
                    <button className="inner-circle my-button" onClick={() => addClick()}>
                        
                    </button>
                    <div className="energy progress-circle" style={progress}></div>
                </div>
                <p className="energy-count font-bold text-xl">{currentEnergy}/1000</p>
                <Flex className="navigation my-button" vertical={false} justify='space-around' align='center'>
                    <LuShoppingCart fontSize={30} color="#808080"/>
                    <IoIosArrowUp fontSize={30} color="#808080"/>
                    <RiSettings4Line fontSize={30} color="#808080"/>
                </Flex>
            </Flex>
        </>
    )
}

export default Home