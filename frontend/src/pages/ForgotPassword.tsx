import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface ForgotPasswordForm {
  username: string;
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordForm>({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://hmseok.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || '임시 비밀번호가 생성되었습니다. 이메일을 확인해주세요.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(data.message || '비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      setMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🔑 비밀번호 찾기</h1>
          <p className="login-subtitle">가입 시 등록한 아이디와 이메일을 입력해주세요</p>
        </div>

        {message && (
          <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">아이디</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? '처리 중...' : '비밀번호 찾기'}
          </button>
        </form>

        <div className="register-link">
          <p>로그인으로 돌아가기 <a href="/login">로그인</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 