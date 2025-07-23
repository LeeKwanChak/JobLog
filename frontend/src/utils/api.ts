import axios from 'axios';
import {getToken} from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({ 
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
    return Promise.reject(error);
  }
)

export default api;