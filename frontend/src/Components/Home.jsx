import axios from "../axios";
import React, { useState, useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { RiSettings4Line } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";

import { Flex } from 'antd';

const Home = () => {
    const boxStyle = {
        position: "relative",
        top: "1rem",
        width: '100%',
        height: '100%',
    };

    const progress = {
        '--progress': '55%'
    }

    const fuck = () => {
        axios.post('/users/getUserData', 11).then((response) => {
            console.log(response.data);
        })
    }
    
    useEffect(() => {
        
    })

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
                    <p>0</p>
                </div>
                <div className="main-circle my-input">
                    <button className="inner-circle my-button">
                    </button>
                    <div className="energy progress-circle" style={progress}></div>
                </div>
                <p className="energy-count font-bold text-xl">1000/1000</p>
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