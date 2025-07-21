import axios from 'axios';

const Instance = axios.create({
  baseURL: 'http://192.168.27.205:8080/',
  withCredentials: true,
});

export default Instance;
