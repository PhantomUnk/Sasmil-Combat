import axios from "axios";

const instance = axios.create({
    baseURL: 'https://02d3-176-214-112-179.ngrok-free.app',
    headers: {
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "content-type": "application/json",
            "ngrok-skip-browser-warning": 1231,
        }
});

export default instance;