import axios from "axios";

const instance = axios.create({
    baseURL: 'https://5c42-176-214-112-179.ngrok-free.app',
    headers: {
            "ngrok-skip-browser-warning": 1231,
        }
});

export default instance;