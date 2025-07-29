import React, { useState, useEffect } from 'react';
import './DepositList.css';

interface Deposit {
  id: number;
  customerName: string;
  amount: number;
  date: string;
  method: string;
  description: string;
  status: string;
}

const DepositList: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDeposits([
      {
        id: 1,
        customerName: '홍길동',
        amount: 1500000,
        date: '2024-07-26',
        method: '보험금',
        description: '사고 정비비 입금',
        status: '완료'
      },
      {
        id: 2,
        customerName: '김철수',
        amount: 500000,
        date: '2024-07-25',
        method: '현금',
        description: '일반 정비비 입금',
        status: '완료'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="deposit-list">
      <h1>입금 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>고객명</th>
              <th>금액</th>
              <th>입금일</th>
              <th>입금방법</th>
              <th>설명</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id}>
                <td>{deposit.id}</td>
                <td>{deposit.customerName}</td>
                <td>{deposit.amount.toLocaleString()}원</td>
                <td>{deposit.date}</td>
                <td>{deposit.method}</td>
                <td>{deposit.description}</td>
                <td>{deposit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositList; 