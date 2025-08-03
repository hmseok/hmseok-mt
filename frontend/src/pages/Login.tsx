import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginForm {
  userId: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 페이지 접속 시 이미 로그인된 상태인지 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // 이미 로그인된 상태라면 홈으로 리다이렉트
      console.log('이미 로그인된 상태 - 홈으로 리다이렉트');
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://hmseok.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('로그인 성공:', data);
        
        // 토큰 저장
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId || data.username,
          role: data.role,
          fullName: data.fullName
        }));
        
        console.log('토큰 저장 완료:', localStorage.getItem('token'));
        console.log('사용자 정보 저장 완료:', localStorage.getItem('user'));
        
        // 홈으로 이동
        navigate('/');
      } else {
        console.log('로그인 실패:', data);
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🔐 로그인</h1>
          <p className="login-subtitle">Hmseok 업무 시스템에 오신 것을 환영합니다</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">아이디</label>
            <input
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleInputChange}
              className="form-input"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="register-link">
          <p>계정이 없으신가요? <a href="/register">회원가입하기</a></p>
          <p>아이디를 잊으셨나요? <a href="/forgot-user-id">아이디 찾기</a></p>
          <p>비밀번호를 잊으셨나요? <a href="/forgot-password">비밀번호 찾기</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 