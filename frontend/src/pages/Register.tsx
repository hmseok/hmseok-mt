import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

interface UserRole {
  value: string;
  displayName: string;
  description: string;
  icon: string;
}

interface RegisterForm {
  userId: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    userId: '',
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // 새로고침 시 메인페이지로 이동
    const handleBeforeUnload = () => {
      navigate('/');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  // 회원가입 페이지 접속 시 기존 토큰 클리어
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    // 기본 역할 설정
    const defaultRoles: UserRole[] = [
      {
        value: 'EMPLOYEE',
        displayName: '직원',
        description: '회사 내부 업무를 담당하는 직원',
        icon: '👨‍💼'
      },
      {
        value: 'PARTNER',
        displayName: '비즈니스 파트너',
        description: '거래 및 협력을 담당하는 파트너사',
        icon: '🤝'
      },
      {
        value: 'SUPPLIER',
        displayName: '협력사',
        description: '전략적 협력을 담당하는 협력업체',
        icon: '🏢'
      },
      {
        value: 'USER',
        displayName: '일반 사용자',
        description: '시스템을 이용하는 일반 사용자',
        icon: '👤'
      },
      {
        value: 'ADMIN',
        displayName: '시스템 관리자',
        description: '시스템 전체를 관리하는 관리자',
        icon: '🔧'
      }
    ];
    setRoles(defaultRoles);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 전화번호 포맷팅
    if (name === 'phoneNumber') {
      const phoneNumber = value.replace(/[^0-9]/g, ''); // 숫자만 추출
      let formattedNumber = '';
      
      if (phoneNumber.length <= 3) {
        formattedNumber = phoneNumber;
      } else if (phoneNumber.length <= 7) {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
      
      setForm(prev => ({
        ...prev,
        [name]: formattedNumber
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoleSelect = (roleValue: string) => {
    setForm(prev => ({
      ...prev,
      role: roleValue
    }));
  };

  const validateForm = () => {
    if (!form.userId || !form.password || !form.email || !form.fullName || !form.role) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }
    
    // 아이디 최소 5자리 검증
    if (form.userId.length < 5) {
      setError('아이디는 최소 5자리 이상이어야 합니다.');
      return false;
    }
    
    // 비밀번호 복잡성 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.');
      return false;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('https://hmseok.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: form.userId,
          password: form.password,
          email: form.email,
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          role: form.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // 서버에서 반환된 구체적인 오류 메시지 표시
        const errorMessage = data.message || '회원가입에 실패했습니다.';
        setError(errorMessage);
        
        // 콘솔에 디버깅 정보 출력
        console.error('회원가입 실패:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      setError('서버 연결에 실패했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">🔐 회원가입</h1>
          <p className="register-subtitle">Hmseok 업무 시스템에 오신 것을 환영합니다</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
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
              <label className="form-label">이름</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="실명을 입력하세요"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '숨기기' : '보이기'}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호 확인</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? '숨기기' : '보이기'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">사용자 역할</label>
            <div className="role-selection">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`role-option ${form.role === role.value ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(role.value)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <div className="role-content">
                    <div className="role-title">{role.displayName}</div>
                    <div className="role-description">{role.description}</div>
                  </div>
                  <div className="role-checkbox">
                    {form.role === role.value && <span className="checkmark">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-link">
          <p>이미 계정이 있으신가요? <a href="/login">로그인하기</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register; 