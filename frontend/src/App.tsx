import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import VehicleInfo from './pages/VehicleInfo';
import AccidentList from './pages/AccidentList';
import EstimateList from './pages/EstimateList';
import RepairList from './pages/RepairList';
import AccountingList from './pages/AccountingList';
import MySchedule from './pages/MySchedule';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ForgotUserId from './pages/ForgotUserId';
import UserManagement from './pages/UserManagement';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  console.log('App 컴포넌트 렌더링 - 보안 시스템 활성화');
  
  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('인증 상태 확인 시작');
      console.log('토큰 존재:', !!token);
      console.log('사용자 정보 존재:', !!user);
      
      if (token && user) {
        console.log('토큰 및 사용자 정보 존재 - 로그인 상태 유지');
        setIsAuthenticated(true);
      } else {
        console.log('토큰 또는 사용자 정보 없음');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // 로그인 상태 확인 함수
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('인증 상태 확인 - 토큰:', token ? '있음' : '없음');
    console.log('인증 상태 확인 - 사용자:', user ? '있음' : '없음');
    return !!(token && user);
  };

  // 보호된 라우트 컴포넌트
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const authenticated = isAuthenticated || checkAuthentication();
    console.log('인증 상태:', authenticated ? '로그인됨' : '로그인 필요');
    return authenticated ? <>{children}</> : <Navigate to="/login" />;
  };

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
      {isAuthenticated && <Navigation />}
      <div className="content">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-user-id" element={<ForgotUserId />} />
          
          {/* 보호된 라우트 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          } />
          <Route path="/vehicle-info" element={
            <ProtectedRoute>
              <VehicleInfo />
            </ProtectedRoute>
          } />
          <Route path="/accidents" element={
            <ProtectedRoute>
              <AccidentList />
            </ProtectedRoute>
          } />
          <Route path="/estimates" element={
            <ProtectedRoute>
              <EstimateList />
            </ProtectedRoute>
          } />
          <Route path="/repairs" element={
            <ProtectedRoute>
              <RepairList />
            </ProtectedRoute>
          } />
          <Route path="/accounting" element={
            <ProtectedRoute>
              <AccountingList />
            </ProtectedRoute>
          } />
          <Route path="/my-schedule" element={
            <ProtectedRoute>
              <MySchedule />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App; 