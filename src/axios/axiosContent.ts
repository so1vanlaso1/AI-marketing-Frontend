import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL_CONTENT;

export const axiosContent = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosContent;