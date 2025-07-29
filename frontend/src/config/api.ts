import axios from 'axios';

// 간단한 환경 감지
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment ? 'http://localhost:8080' : 'https://api.carrepair.hmseok.com';

// axios 기본 설정
axios.defaults.baseURL = API_BASE_URL;

export default axios; 