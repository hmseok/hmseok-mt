import React, { useState, useEffect } from 'react';
import apiClient from '../config/api';
import './AccountingList.css';

interface Accounting {
  id: number;
  repairId: number;
  carNumber: string;
  date: string;
  type: string;
  amount: number;
  description: string;
}

const AccountingList: React.FC = () => {
  const [accountings, setAccountings] = useState<Accounting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountings();
  }, []);

  const fetchAccountings = async () => {
    try {
      const data = await apiClient.get('/accountings');
      setAccountings(data);
    } catch (error) {
      console.error('회계 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="accounting-list">
      <h1>회계 관리</h1>
      <div className="accounting-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>차량번호</th>
              <th>날짜</th>
              <th>유형</th>
              <th>금액</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {accountings.map((accounting) => (
              <tr key={accounting.id}>
                <td>{accounting.id}</td>
                <td>{accounting.carNumber}</td>
                <td>{accounting.date}</td>
                <td>{accounting.type}</td>
                <td>{accounting.amount.toLocaleString()}원</td>
                <td>{accounting.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountingList; 