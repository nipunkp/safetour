import axios from 'axios';

export const BASE_URL = 'https://safetour-582o.onrender.com'; // 👈 CHANGE WHEN NEEDED

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default API;
