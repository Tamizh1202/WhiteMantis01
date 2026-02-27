import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export default axiosClient;