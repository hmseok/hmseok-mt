import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './AccidentList.css';

interface Accident {
  id: number;
  carId: number;
  carNumber: string;
  accidentDate: string;
  description: string;
  status: string;
}

const AccidentList: React.FC = () => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const fetchAccidents = async () => {
    try {
      const data = await apiClient.get('/accidents');
      setAccidents(data);
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
              <th>차량번호</th>
              <th>사고일자</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {accidents.map((accident) => (
              <tr key={accident.id}>
                <td>{accident.id}</td>
                <td>{accident.carNumber}</td>
                <td>{accident.accidentDate}</td>
                <td>{accident.description}</td>
                <td>{accident.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccidentList; 