import React, { useState, useEffect } from 'react';
import './WithdrawalList.css';

interface Withdrawal {
  id: number;
  purpose: string;
  amount: number;
  date: string;
  method: string;
  description: string;
  status: string;
}

const WithdrawalList: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWithdrawals([
      {
        id: 1,
        purpose: '부품 구매',
        amount: 500000,
        date: '2024-07-26',
        method: '계좌이체',
        description: '엔진오일 및 부품 구매',
        status: '완료'
      },
      {
        id: 2,
        purpose: '운영비',
        amount: 300000,
        date: '2024-07-25',
        method: '현금',
        description: '월 운영비 지출',
        status: '완료'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="withdrawal-list">
      <h1>출금 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>용도</th>
              <th>금액</th>
              <th>출금일</th>
              <th>출금방법</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id}>
                <td>{withdrawal.id}</td>
                <td>{withdrawal.purpose}</td>
                <td>{withdrawal.amount.toLocaleString()}원</td>
                <td>{withdrawal.date}</td>
                <td>{withdrawal.method}</td>
                <td>{withdrawal.description}</td>
                <td>{withdrawal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalList; 