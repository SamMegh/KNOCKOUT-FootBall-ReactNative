import axios from 'axios';
import { getItem } from './asyncstorage';

const Instance = axios.create({
  baseURL: 'http://192.168.1.11:8080/',
  withCredentials: true,
});
Instance.interceptors.request.use(async (config) => {
  const token = await getItem();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Instance;
