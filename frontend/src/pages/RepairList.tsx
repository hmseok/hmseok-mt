import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './RepairList.css';

interface Repair {
  id: number;
  estimateId: number;
  carNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}

const RepairList: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const data = await apiClient.get('/api/repairs');
      setRepairs(data);
    } catch (error) {
      console.error('수리 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="repair-list">
      <h1>수리 관리</h1>
      <div className="repair-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>차량번호</th>
              <th>시작일</th>
              <th>완료일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.id}</td>
                <td>{repair.carNumber}</td>
                <td>{repair.startDate}</td>
                <td>{repair.endDate}</td>
                <td>{repair.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepairList; 