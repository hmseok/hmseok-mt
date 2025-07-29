import axios from 'axios';

// 환경 변수에서 API URL 가져오기, 없으면 기본값 사용
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' // 실제 백엔드 도메인으로 변경 필요
    : 'http://localhost:8080');

// axios 기본 설정
axios.defaults.baseURL = API_BASE_URL;

export default axios; 