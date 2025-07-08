import axios from 'axios';

const Instance = axios.create({
        baseURL: import.meta.env.MODE==="development"?'http://localhost:8081/api/':"/api",
    withCredentials: true,
})