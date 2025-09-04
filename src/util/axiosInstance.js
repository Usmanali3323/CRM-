// src/api/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ems-backend-6yyi.onrender.com', // Replace with your backend API URL
  withCredentials:true,
  timeout: 30000, // Optional: Set timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;