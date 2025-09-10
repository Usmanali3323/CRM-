// src/api/axiosConfig.js
import axios from 'axios';


const instance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend API URL
  timeout: 30000, // Optional: Set timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

 const token = localStorage.getItem("accessToken");
if(token)
 instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default instance;