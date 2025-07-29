import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EstimateList.css';

interface Estimate {
  id: number;
  totalCost: number;
  createdAt: string;
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

const EstimateList: React.FC = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    try {
      const response = await axios.get('/api/estimates');
      setEstimates(response.data);
    } catch (error) {
      console.error('견적 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="estimate-list">
      <h1>견적 관리</h1>
      <div className="estimate-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>총 견적 금액</th>
              <th>견적일</th>
              <th>차량번호</th>
              <th>고객명</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => (
              <tr key={estimate.id}>
                <td>{estimate.id}</td>
                <td>{estimate.totalCost.toLocaleString()}원</td>
                <td>{estimate.createdAt}</td>
                <td>{estimate.accident.car.number}</td>
                <td>{estimate.accident.car.customer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateList; 