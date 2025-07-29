import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

interface UserRole {
  value: string;
  displayName: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: ''
  });
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // 사용자 역할 목록 가져오기
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://54.180.88.243:8080/api/auth/roles');
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error('역할 목록을 가져오는데 실패했습니다:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return false;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return false;
    }
    if (!form.role) {
      setError('사용자 역할을 선택해주세요');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://54.180.88.243:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          role: form.role
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || '회원가입에 실패했습니다');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>👤 회원가입</h1>
          <p>Hmseok 업무 시스템에 가입하세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">사용자명 *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="3-20자 사이"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fullName">이름 *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="실명을 입력하세요"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">전화번호</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="01012345678"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">비밀번호 *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="최소 6자 이상"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인 *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">사용자 역할 *</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">역할을 선택하세요</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.displayName}
                </option>
              ))}
            </select>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>이미 계정이 있으신가요?</p>
          <button 
            onClick={() => navigate('/login')} 
            className="login-link"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register; 