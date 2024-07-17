import axios from "../axios";
import React, { useState, useEffect } from "react";
import '../Scss/Home/Home.css';

const Home = () => {

    const fuck = () => {
        axios.post('/users/getUserData', 11).then((response) => {
            console.log(response.data);
        })
    }
    
    useEffect(() => {
        
    })

    return(
        <>
            <h1 className="text-xl font-bold underline">
                Hello world!
            </h1>
        </>
    )
}

export default Home