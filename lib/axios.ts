import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Automatically attach the payload-token from cookies on every request
axiosClient.interceptors.request.use((config) => {
    const payloadToken = Cookies.get('paylaod-token');

    if (payloadToken) {
        config.headers['Authorization'] = `JWT ${payloadToken}`;
    }

    return config;
});

export default axiosClient;