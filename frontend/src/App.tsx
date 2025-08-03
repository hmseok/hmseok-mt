import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ForgotUserId from './pages/ForgotUserId';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  console.log('App 컴포넌트 렌더링');
  
  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('인증 상태 확인');
      console.log('토큰 존재:', !!token);
      console.log('사용자 정보 존재:', !!user);
      
      if (token && user) {
        console.log('로그인 상태 유지');
        setIsAuthenticated(true);
      } else {
        console.log('로그인 필요');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>인증 상태를 확인하는 중...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="content">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-user-id" element={<ForgotUserId />} />
          
          {/* 기본 라우트 - 로그인 상태에 따라 리다이렉트 */}
          <Route path="/" element={
            isAuthenticated ? 
              <div>
                <h1>대시보드</h1>
                <p>로그인 성공! 메인 페이지입니다.</p>
              </div> : 
              <Navigate to="/login" />
          } />
          
          {/* 기타 모든 경로는 로그인 페이지로 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App; 