import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './CarList.css';

interface Car {
  id: number;
  customerId: number;
  customerName: string;
  carNumber: string;
  carType: string;
  carYear: string;
  carColor: string;
}

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await apiClient.get('/api/cars');
      setCars(data);
    } catch (error) {
      console.error('차량 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="car-list">
      <h1>차량 관리</h1>
      <div className="car-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>고객명</th>
              <th>차량번호</th>
              <th>차종</th>
              <th>연식</th>
              <th>색상</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.customerName}</td>
                <td>{car.carNumber}</td>
                <td>{car.carType}</td>
                <td>{car.carYear}</td>
                <td>{car.carColor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList; 