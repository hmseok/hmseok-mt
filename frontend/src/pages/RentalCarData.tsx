import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './RentalCarData.css';

interface RentalCar {
  id: number;
  carNumber: string;
  carModel: string;
  rentalStatus: string;
  customerName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalAmount: number;
  location: string;
}

const RentalCarData: React.FC = () => {
  const [rentalCars, setRentalCars] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRentalCarData();
  }, []);

  const fetchRentalCarData = async () => {
    try {
      setLoading(true);
      // 실제 API가 없으므로 샘플 데이터 사용
      const sampleData: RentalCar[] = [
        {
          id: 1,
          carNumber: '12가3456',
          carModel: '현대 아반떼',
          rentalStatus: '대여중',
          customerName: '김철수',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          dailyRate: 50000,
          totalAmount: 250000,
          location: '서울 강남구'
        },
        {
          id: 2,
          carNumber: '34나5678',
          carModel: '기아 K5',
          rentalStatus: '대여중',
          customerName: '이영희',
          startDate: '2024-01-16',
          endDate: '2024-01-18',
          dailyRate: 60000,
          totalAmount: 120000,
          location: '서울 서초구'
        },
        {
          id: 3,
          carNumber: '56다7890',
          carModel: '현대 그랜저',
          rentalStatus: '반납완료',
          customerName: '박민수',
          startDate: '2024-01-10',
          endDate: '2024-01-14',
          dailyRate: 80000,
          totalAmount: 320000,
          location: '서울 마포구'
        },
        {
          id: 4,
          carNumber: '78라1234',
          carModel: '기아 스포티지',
          rentalStatus: '대여중',
          customerName: '최지영',
          startDate: '2024-01-17',
          endDate: '2024-01-25',
          dailyRate: 45000,
          totalAmount: 360000,
          location: '서울 송파구'
        },
        {
          id: 5,
          carNumber: '90마5678',
          carModel: '현대 투싼',
          rentalStatus: '반납완료',
          customerName: '정수민',
          startDate: '2024-01-08',
          endDate: '2024-01-12',
          dailyRate: 70000,
          totalAmount: 280000,
          location: '서울 영등포구'
        }
      ];
      
      setRentalCars(sampleData);
      setLoading(false);
    } catch (error) {
      console.error('렌터카 데이터를 불러오는데 실패했습니다:', error);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const filteredCars = rentalCars.filter(car => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && car.rentalStatus === '대여중') ||
      (filter === 'completed' && car.rentalStatus === '반납완료');
    
    const matchesSearch = car.carNumber.includes(searchTerm) ||
      car.carModel.includes(searchTerm) ||
      car.customerName.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return status === '대여중' ? '#ff6b6b' : '#51cf66';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  if (loading) {
    return <div className="loading">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="rental-car-data">
      <div className="page-header">
        <h1>🚗 렌터카 실행데이터</h1>
        <p>실시간 렌터카 대여 현황 및 데이터 관리</p>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="차량번호, 모델, 고객명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            전체 ({rentalCars.length})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            대여중 ({rentalCars.filter(car => car.rentalStatus === '대여중').length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            반납완료 ({rentalCars.filter(car => car.rentalStatus === '반납완료').length})
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>총 대여 차량</h3>
          <p className="stat-number">{rentalCars.length}대</p>
        </div>
        <div className="stat-card">
          <h3>현재 대여중</h3>
          <p className="stat-number">{rentalCars.filter(car => car.rentalStatus === '대여중').length}대</p>
        </div>
        <div className="stat-card">
          <h3>총 수익</h3>
          <p className="stat-number">₩{formatCurrency(rentalCars.reduce((sum, car) => sum + car.totalAmount, 0))}</p>
        </div>
      </div>

      <div className="rental-table">
        <table>
          <thead>
            <tr>
              <th>차량번호</th>
              <th>모델</th>
              <th>상태</th>
              <th>고객명</th>
              <th>대여기간</th>
              <th>일일요금</th>
              <th>총금액</th>
              <th>위치</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.id}>
                <td className="car-number">{car.carNumber}</td>
                <td className="car-model">{car.carModel}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(car.rentalStatus) }}
                  >
                    {car.rentalStatus}
                  </span>
                </td>
                <td className="customer-name">{car.customerName}</td>
                <td className="rental-period">
                  {car.startDate} ~ {car.endDate}
                </td>
                <td className="daily-rate">₩{formatCurrency(car.dailyRate)}</td>
                <td className="total-amount">₩{formatCurrency(car.totalAmount)}</td>
                <td className="location">{car.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCars.length === 0 && (
        <div className="no-data">
          <p>검색 조건에 맞는 렌터카 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default RentalCarData; 