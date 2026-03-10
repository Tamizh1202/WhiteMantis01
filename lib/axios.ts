import axios from 'axios';
import { getSession } from 'next-auth/react';
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

// Automatically attach the payload-token (from session or cookies) on every request
axiosClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    // Try to get token from session first, then fallback to cookies
    const payloadToken = session?.user?.['paylaod-token'] || Cookies.get('paylaod-token');

    if (payloadToken) {
        config.headers['Authorization'] = `JWT ${payloadToken}`;
    }

    return config;
});

export default axiosClient;