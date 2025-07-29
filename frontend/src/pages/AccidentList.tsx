import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import './AccidentList.css';

interface Accident {
  id: number;
  date: string;
  location: string;
  description: string;
  status: string;
  car: {
    id: number;
    number: string;
    customer: {
      name: string;
    };
  };
}

const AccidentList: React.FC = () => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      const response = await axios.get('/api/accidents');
      setAccidents(response.data);
    } catch (error) {
      console.error('사고 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="accident-list">
      <h1>사고 관리</h1>
      <div className="accident-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>발생일</th>
              <th>위치</th>
              <th>설명</th>
              <th>상태</th>
              <th>차량번호</th>
              <th>소유자</th>
            </tr>
          </thead>
          <tbody>
            {accidents.map((accident) => (
              <tr key={accident.id}>
                <td>{accident.id}</td>
                <td>{accident.date}</td>
                <td>{accident.location}</td>
                <td>{accident.description}</td>
                <td>{accident.status}</td>
                <td>{accident.car.number}</td>
                <td>{accident.car.customer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccidentList; 