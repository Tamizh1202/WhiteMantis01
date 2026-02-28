import axios from 'axios';
import { getSession } from 'next-auth/react';

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

// Automatically attach the payload-token from NextAuth session on every request
axiosClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    const payloadToken = session?.user?.['paylaod-token'];

    if (payloadToken) {
        config.headers['Authorization'] = `JWT ${payloadToken}`;
    }

    return config;
});

export default axiosClient;