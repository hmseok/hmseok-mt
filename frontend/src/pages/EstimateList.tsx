import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './EstimateList.css';

interface Estimate {
  id: number;
  accidentId: number;
  carNumber: string;
  estimateDate: string;
  totalAmount: number;
  status: string;
}

const EstimateList: React.FC = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    try {
      const data = await apiClient.get('/api/estimates');
      setEstimates(data);
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
              <th>차량번호</th>
              <th>견적일자</th>
              <th>총 금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => (
              <tr key={estimate.id}>
                <td>{estimate.id}</td>
                <td>{estimate.carNumber}</td>
                <td>{estimate.estimateDate}</td>
                <td>{estimate.totalAmount.toLocaleString()}원</td>
                <td>{estimate.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateList; 