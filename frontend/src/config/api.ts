import axios from 'axios';

// 단순한 환경 감지 - process.env 사용하지 않음
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment ? 'http://localhost:8080' : 'https://api.carrepair.hmseok.com';

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// axios 기본 설정
axios.defaults.baseURL = API_BASE_URL;

export default axios; 