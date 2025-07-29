import React from 'react';
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
import UserManagement from './pages/UserManagement';
import './App.css';

const App: React.FC = () => {
  console.log('App 컴포넌트 렌더링 - 보안 시스템 활성화');
  
  // 로그인 상태 확인
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log('토큰 확인:', token ? '있음' : '없음');
    return !!token;
  };

  // 보호된 라우트 컴포넌트
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const authenticated = isAuthenticated();
    console.log('인증 상태:', authenticated ? '로그인됨' : '로그인 필요');
    return authenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      {isAuthenticated() && <Navigation />}
      <div className="content">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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