import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>대시보드</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>고객 현황</h3>
          <p>총 고객 수: 0명</p>
        </div>
        <div className="dashboard-card">
          <h3>차량 현황</h3>
          <p>등록된 차량: 0대</p>
        </div>
        <div className="dashboard-card">
          <h3>사고 현황</h3>
          <p>처리 중인 사고: 0건</p>
        </div>
        <div className="dashboard-card">
          <h3>정비 현황</h3>
          <p>진행 중인 정비: 0건</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 