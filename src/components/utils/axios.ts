import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// VERY IMPORTANT — disable forced JSON, allow FormData (must be before export)
axiosInstance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axiosInstance.defaults.transformRequest = (data, headers) => data;

export default axiosInstance;
