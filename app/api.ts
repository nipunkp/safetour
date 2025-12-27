import axios from 'axios';

export const BASE_URL = 'http://10.57.151.28:5000'; // 👈 CHANGE WHEN NEEDED

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default API;
