import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    accidents: 0,
    repairs: 0
  });

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('인증되지 않은 사용자 - 로그인 페이지로 리다이렉트');
      navigate('/login');
      return;
    }
    
    console.log('인증된 사용자 - 대시보드 접근 허용');
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API 호출로 통계 데이터 가져오기
        const vehiclesResponse = await fetch('https://hmseok.com/api/cars');
        const accidentsResponse = await fetch('https://hmseok.com/api/accidents');
        const repairsResponse = await fetch('https://hmseok.com/api/repairs');

        const vehiclesData = await vehiclesResponse.json();
        const accidentsData = await accidentsResponse.json();
        const repairsData = await repairsResponse.json();

        setStats({
          vehicles: vehiclesData.length || 0,
          accidents: accidentsData.length || 0,
          repairs: repairsData.length || 0
        });
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>로드되었습니다!</h1>
      <p>남동하고 있습니다.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>차량 현황</h3>
          <p>등록된 차량: {stats.vehicles}대</p>
        </div>
        <div className="dashboard-card">
          <h3>사고 현황</h3>
          <p>처리 중인 사고: {stats.accidents}건</p>
        </div>
        <div className="dashboard-card">
          <h3>정비 현황</h3>
          <p>진행 중인 정비: {stats.repairs}건</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 