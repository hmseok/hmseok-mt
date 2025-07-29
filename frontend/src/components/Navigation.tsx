import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '대시보드' },
    { path: '/customers', label: '고객 관리' },
    { path: '/cars', label: '차량 관리' },
    { path: '/accidents', label: '사고 관리' },
    { path: '/estimates', label: '견적 관리' },
    { path: '/repairs', label: '정비 관리' },
    { path: '/accounting', label: '회계 관리' },
    { path: '/staff', label: '직원 관리' },
    { path: '/parts', label: '부품 관리' },
    { path: '/payments', label: '결제 관리' },
    { path: '/todos', label: '할일 관리' },
    { path: '/partners', label: '협력업체 관리' },
    { path: '/deposits', label: '입금 관리' },
    { path: '/withdrawals', label: '출금 관리' },
    { path: '/contracts', label: '계약 관리' },
    { path: '/my-schedule', label: '나의 스케줄' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Hmseok 업무</h2>
      </div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 