import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import './RepairList.css';

interface Repair {
  id: number;
  item: string;
  cost: number;
  description: string;
  accident: {
    id: number;
    car: {
      number: string;
      customer: {
        name: string;
      };
    };
  };
}

const RepairList: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const response = await axios.get('/api/repairs');
      setRepairs(response.data);
    } catch (error) {
      console.error('정비 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="repair-list">
      <h1>정비 관리</h1>
      <div className="repair-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>정비 항목</th>
              <th>비용</th>
              <th>설명</th>
              <th>차량번호</th>
              <th>고객명</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.id}</td>
                <td>{repair.item}</td>
                <td>{repair.cost.toLocaleString()}원</td>
                <td>{repair.description}</td>
                <td>{repair.accident.car.number}</td>
                <td>{repair.accident.car.customer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairList; 