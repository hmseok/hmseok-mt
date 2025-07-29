import React, { useState } from 'react';
import RentalCarData from './RentalCarData';
import CarList from './CarList';
import './VehicleInfo.css';

const VehicleInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rental' | 'management'>('rental');

  return (
    <div className="vehicle-info">
      <div className="page-header">
        <h1>🚗 차량정보</h1>
        <p>렌터카 실행데이터 및 차량 관리 시스템</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'rental' ? 'active' : ''}`}
          onClick={() => setActiveTab('rental')}
        >
          📊 렌터카 실행데이터
        </button>
        <button
          className={`tab-button ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          🔧 차량관리
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'rental' && <RentalCarData />}
        {activeTab === 'management' && <CarList />}
      </div>
    </div>
  );
};

export default VehicleInfo; 