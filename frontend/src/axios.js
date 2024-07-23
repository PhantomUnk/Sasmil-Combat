import axios from "axios";

const instance = axios.create({
    baseURL: 'https://b894-176-214-112-179.ngrok-free.app',
    headers: {
            "ngrok-skip-browser-warning": 1231,
        }
});

export default instance;