import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface ForgotUserIdForm {
  fullName: string;
  email: string;
}

const ForgotUserId: React.FC = () => {
  const [formData, setFormData] = useState<ForgotUserIdForm>({
    fullName: '',
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
      const response = await fetch('https://hmseok.com/api/auth/forgot-user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || '아이디가 이메일로 발송되었습니다. 이메일을 확인해주세요.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(data.message || '아이디 찾기에 실패했습니다.');
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
          <h1 className="login-title">🔍 아이디 찾기</h1>
          <p className="login-subtitle">가입 시 등록한 이름과 이메일을 입력해주세요</p>
        </div>

        {message && (
          <div className={`message ${message.includes('발송') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이름</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="이름을 입력하세요"
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
            {isLoading ? '처리 중...' : '아이디 찾기'}
          </button>
        </form>

        <div className="register-link">
          <p>로그인으로 돌아가기 <a href="/login">로그인</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotUserId; 