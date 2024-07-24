import axios from "axios"; // импорт библиотtrb axios

// описываю базовый юрл и headers
const instance = axios.create({
    baseURL: 'https://81a8-176-214-112-179.ngrok-free.app',
    headers: {
            "ngrok-skip-browser-warning": 1231,
        }
});

export default instance;