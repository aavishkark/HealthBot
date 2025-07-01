import axios from 'axios';

const API = axios.create({
  baseURL: 'https://healthbotbackend.onrender.com/',
  withCredentials: true,
});

export default API;
