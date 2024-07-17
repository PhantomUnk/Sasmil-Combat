import axios from "../axios";
import React, { useState, useEffect } from "react";

const Home = () => {
    const [data, setData] = useState([])
    const fuck = () => {
        axios.get('users', {"a":1}).then((response) => {
            console.log(response.data);
        })
    }

    useEffect(() => {
        fuck();
    })
    return(
        <>
            {data}
        </>
    )
}

export default Home