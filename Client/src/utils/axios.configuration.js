import axios from 'axios';

const Instance = axios.create({
  baseURL: 'http://192.168.1.5:8080/',
  withCredentials: true,
});

export default Instance;
