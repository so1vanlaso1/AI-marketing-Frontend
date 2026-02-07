import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESSID = process.env.NEXT_PUBLIC_ACCESSID;

export const axiosUser = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'AccessID': ACCESSID,
    }
});

// Add a request interceptor to set Bearer token from cookies/localStorage
axiosUser.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        // Get token from cookies or localStorage
        const token = Cookies.get('accessToken') || localStorage.getItem('accessToken') || '';
        
        if (token) {
            // Add Bearer prefix to Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosUser;