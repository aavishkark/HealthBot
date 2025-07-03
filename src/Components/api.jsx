import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthbotbackend-1.onrender.com',
  withCredentials: true,
});

export default API;
