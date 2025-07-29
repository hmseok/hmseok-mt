import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './RentalCarData.css';

interface LongTermRentalCar {
  id: number;
  executionNumber: string; // 실행번호
  customerName: string; // 고객명
  carNumber: string; // 차량번호
  carModel: string; // 차종
  carRegistrationDate: string; // 차량등록일자
  creditStartDate: string; // 여신시작일
  creditPeriod: string; // 여신기간
  creditMaturityDate: string; // 여신만기일
  executionReason: string; // 실행사유
  carOptions: string; // 차량옵션
  chassisNumber: string; // 차대번호
  insuranceCompany: string; // 보험사
  age: number; // 연령
  insuranceStartDate: string; // 보험개시일
  insurancePeriod: string; // 보험기간
  personalLiability: string; // 대인배상
  propertyDamage: string; // 대물
  personalAccident: string; // 자기신체사고
  uninsuredInjury: string; // 무보험차상해
  selfLiabilityMaintenance: string; // 자기부담금(정비)
  emergencyDispatch: string; // 긴급출동
  monthlyMaintenanceFee: number; // 월정비료
  maintenanceProduct: string; // 정비상품
  snowTire: string; // 스노우타이어
  chain: string; // 체인
  customerManager: string; // 고객담당자
  phone: string; // 전화
  mobile: string; // 휴대폰
  billingAddress: string; // 청구지 주소
  maintenanceCompany: string; // 정비업체명
  closingDate: string; // 마감일자
  cancellationDate: string; // 해지일자
  salesDepartment: string; // 영업부서
  salesManager: string; // 영업담당자
  executionRegistrant: string; // 실행등록자
}

const RentalCarData: React.FC = () => {
  const [rentalCars, setRentalCars] = useState<LongTermRentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, maintenance
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRentalCarData();
  }, []);

  const fetchRentalCarData = async () => {
    try {
      setLoading(true);
      // 장기렌터카 실행데이터 샘플
      const sampleData: LongTermRentalCar[] = [
        {
          id: 1,
          executionNumber: 'EX-2024-001',
          customerName: '김철수',
          carNumber: '12가3456',
          carModel: '현대 그랜저',
          carRegistrationDate: '2024-01-15',
          creditStartDate: '2024-01-15',
          creditPeriod: '6개월',
          creditMaturityDate: '2024-07-15',
          executionReason: '장기렌터카',
          carOptions: '네비게이션, 후방카메라',
          chassisNumber: 'KMHXX00XXXX000001',
          insuranceCompany: '삼성화재',
          age: 35,
          insuranceStartDate: '2024-01-15',
          insurancePeriod: '6개월',
          personalLiability: '무제한',
          propertyDamage: '1억원',
          personalAccident: '1억원',
          uninsuredInjury: '1억원',
          selfLiabilityMaintenance: '30만원',
          emergencyDispatch: '포함',
          monthlyMaintenanceFee: 50000,
          maintenanceProduct: '정기정비',
          snowTire: '미포함',
          chain: '미포함',
          customerManager: '이영희',
          phone: '02-1234-5678',
          mobile: '010-1234-5678',
          billingAddress: '서울시 강남구 테헤란로 123',
          maintenanceCompany: '강남정비소',
          closingDate: '2024-01-15',
          cancellationDate: '',
          salesDepartment: '강남지점',
          salesManager: '박민수',
          executionRegistrant: '김철수'
        },
        {
          id: 2,
          executionNumber: 'EX-2024-002',
          customerName: '이영희',
          carNumber: '34나5678',
          carModel: '기아 K8',
          carRegistrationDate: '2024-02-01',
          creditStartDate: '2024-02-01',
          creditPeriod: '1년',
          creditMaturityDate: '2025-02-01',
          executionReason: '법인렌터카',
          carOptions: '전동시트, 헤드업디스플레이',
          chassisNumber: 'KNAXX00XXXX000002',
          insuranceCompany: '현대해상',
          age: 42,
          insuranceStartDate: '2024-02-01',
          insurancePeriod: '1년',
          personalLiability: '무제한',
          propertyDamage: '2억원',
          personalAccident: '2억원',
          uninsuredInjury: '2억원',
          selfLiabilityMaintenance: '50만원',
          emergencyDispatch: '포함',
          monthlyMaintenanceFee: 80000,
          maintenanceProduct: '프리미엄정비',
          snowTire: '포함',
          chain: '포함',
          customerManager: '최지영',
          phone: '02-2345-6789',
          mobile: '010-2345-6789',
          billingAddress: '서울시 서초구 서초대로 456',
          maintenanceCompany: '서초정비소',
          closingDate: '2024-02-01',
          cancellationDate: '',
          salesDepartment: '서초지점',
          salesManager: '정수민',
          executionRegistrant: '이영희'
        },
        {
          id: 3,
          executionNumber: 'EX-2023-003',
          customerName: '박민수',
          carNumber: '56다7890',
          carModel: '현대 투싼',
          carRegistrationDate: '2023-10-01',
          creditStartDate: '2023-10-01',
          creditPeriod: '6개월',
          creditMaturityDate: '2024-04-01',
          executionReason: '개인렌터카',
          carOptions: '선루프, 크루즈컨트롤',
          chassisNumber: 'KMHXX00XXXX000003',
          insuranceCompany: '롯데손보',
          age: 28,
          insuranceStartDate: '2023-10-01',
          insurancePeriod: '6개월',
          personalLiability: '무제한',
          propertyDamage: '1억원',
          personalAccident: '1억원',
          uninsuredInjury: '1억원',
          selfLiabilityMaintenance: '30만원',
          emergencyDispatch: '포함',
          monthlyMaintenanceFee: 60000,
          maintenanceProduct: '정기정비',
          snowTire: '미포함',
          chain: '미포함',
          customerManager: '김철수',
          phone: '02-3456-7890',
          mobile: '010-3456-7890',
          billingAddress: '서울시 마포구 월드컵로 789',
          maintenanceCompany: '마포정비소',
          closingDate: '2023-10-01',
          cancellationDate: '2024-04-01',
          salesDepartment: '마포지점',
          salesManager: '이영희',
          executionRegistrant: '박민수'
        }
      ];
      
      setRentalCars(sampleData);
      setLoading(false);
    } catch (error) {
      console.error('장기렌터카 실행데이터를 불러오는데 실패했습니다:', error);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const filteredCars = rentalCars.filter(car => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && car.cancellationDate === '') ||
      (filter === 'completed' && car.cancellationDate !== '');
    
    const matchesSearch = car.executionNumber.includes(searchTerm) ||
      car.customerName.includes(searchTerm) ||
      car.carNumber.includes(searchTerm) ||
      car.carModel.includes(searchTerm) ||
      car.customerManager.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (cancellationDate: string) => {
    return cancellationDate === '' ? '#ff6b6b' : '#51cf66';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const calculateTotalRevenue = () => {
    return rentalCars.reduce((sum, car) => sum + car.monthlyMaintenanceFee, 0);
  };

  const calculateActiveContracts = () => {
    return rentalCars.filter(car => car.cancellationDate === '').length;
  };

  const calculateTotalContracts = () => {
    return rentalCars.length;
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
        <h1>🚗 장기렌터카 실행데이터</h1>
        <p>장기렌터카 실행 현황 및 상세 정보 관리</p>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="실행번호, 고객명, 차량번호, 차종, 담당자로 검색..."
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
            진행중 ({rentalCars.filter(car => car.cancellationDate === '').length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            완료 ({rentalCars.filter(car => car.cancellationDate !== '').length})
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>총 실행 건수</h3>
          <p className="stat-number">{calculateTotalContracts()}건</p>
        </div>
        <div className="stat-card">
          <h3>진행중인 건수</h3>
          <p className="stat-number">{calculateActiveContracts()}건</p>
        </div>
        <div className="stat-card">
          <h3>총 월정비료</h3>
          <p className="stat-number">₩{formatCurrency(calculateTotalRevenue())}</p>
        </div>
        <div className="stat-card">
          <h3>평균 연령</h3>
          <p className="stat-number">{Math.round(rentalCars.reduce((sum, car) => sum + car.age, 0) / rentalCars.length)}세</p>
        </div>
      </div>

      <div className="rental-table">
        <table>
          <thead>
            <tr>
              <th>실행번호</th>
              <th>고객명</th>
              <th>차량번호</th>
              <th>차종</th>
              <th>여신기간</th>
              <th>보험사</th>
              <th>고객담당자</th>
              <th>영업담당자</th>
              <th>상태</th>
              <th>월정비료</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car) => (
              <tr key={car.id}>
                <td className="execution-number">{car.executionNumber}</td>
                <td className="customer-name">{car.customerName}</td>
                <td className="car-number">{car.carNumber}</td>
                <td className="car-model">{car.carModel}</td>
                <td className="credit-period">{car.creditPeriod}</td>
                <td className="insurance-company">{car.insuranceCompany}</td>
                <td className="customer-manager">{car.customerManager}</td>
                <td className="sales-manager">{car.salesManager}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(car.cancellationDate) }}
                  >
                    {car.cancellationDate === '' ? '진행중' : '완료'}
                  </span>
                </td>
                <td className="monthly-fee">₩{formatCurrency(car.monthlyMaintenanceFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCars.length === 0 && (
        <div className="no-data">
          <p>검색 조건에 맞는 장기렌터카 실행데이터가 없습니다.</p>
        </div>
      )}

      {/* 상세 정보 모달 버튼 */}
      <div className="detail-info">
        <p className="info-text">
          💡 상세 정보는 각 행을 클릭하여 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default RentalCarData; 