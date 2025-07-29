import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { pageStatus } from '../config/pageStatus';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: '대시보드' },
    { path: '/customers', label: '고객 관리' },
    { path: '/vehicle-info', label: '차량정보' },
    { path: '/accidents', label: '사고 관리' },
    { path: '/estimates', label: '견적 관리' },
    { path: '/repairs', label: '정비 관리' },
    { path: '/accounting', label: '회계 관리' },
    { path: '/user-management', label: '사용자 관리' },
    { path: '/my-schedule', label: '나의 스케줄' },
  ];

  // order에 따라 정렬 (공사중인 페이지가 상단으로)
  const sortedNavItems = navItems.sort((a, b) => {
    const orderA = pageStatus[a.path as keyof typeof pageStatus]?.order || 999;
    const orderB = pageStatus[b.path as keyof typeof pageStatus]?.order || 999;
    return orderA - orderB;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserInfo = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const userInfo = getUserInfo();

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Hmseok 업무</h2>
        {userInfo && (
          <div className="user-info">
            <span className="user-name">{userInfo.fullName}</span>
            <span className="user-role">({userInfo.role})</span>
          </div>
        )}
      </div>
      <ul className="nav-list">
        {sortedNavItems.map((item) => {
          const status = pageStatus[item.path as keyof typeof pageStatus];
          const isWorking = status?.working || false;
          const isDisabled = status?.disabled || false;
          
          return (
            <li key={item.path} className={isDisabled ? 'disabled' : ''}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''} ${
                  isWorking ? 'working' : ''
                } ${isDisabled ? 'disabled-link' : ''}`}
              >
                {isWorking && (
                  <span className="working-indicator">
                    🚧 공사중
                  </span>
                )}
                {isDisabled && !isWorking && (
                  <span className="disabled-indicator">
                    🚫 접근금지
                  </span>
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="nav-footer">
        <button onClick={handleLogout} className="logout-button">
          🚪 로그아웃
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 