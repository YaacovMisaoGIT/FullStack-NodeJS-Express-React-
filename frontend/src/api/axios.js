import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3500' //another instance
});

export default api