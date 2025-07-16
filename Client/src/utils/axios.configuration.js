import axios from 'axios';

const Instance = axios.create({
  baseURL: 'http://localhost:8080/',
  withCredentials: true,
});

export default Instance;
