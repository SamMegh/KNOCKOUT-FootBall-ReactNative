import axios from 'axios';
import { getItem } from './asyncstorage';

const Instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
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
