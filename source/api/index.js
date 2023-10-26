import axios from 'axios';

const api = axios.create({
  baseURL: 'https://connect.dlwalt.net/api/v1',
});

export default api;
