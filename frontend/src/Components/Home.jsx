import axios from "../axios";
import React, { useState, useEffect } from "react";

import { Flex } from 'antd';

const Home = () => {
    const boxStyle = {
        position: "relative",
        top: "1rem",
        width: '100%',
        height: '100%',
    };

    const progress = {
        '--progress': '99%'
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
            <Flex vertical='vertical' style={boxStyle} justify='center' align='center'>
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
            </Flex>
        </>
    )
}

export default Home