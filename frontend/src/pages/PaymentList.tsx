import React, { useState, useEffect } from 'react';
import './PaymentList.css';

interface Payment {
  id: number;
  customerName: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  description: string;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPayments([
      {
        id: 1,
        customerName: '홍길동',
        amount: 1500000,
        method: '보험금',
        date: '2024-07-26',
        status: '완료',
        description: '사고 정비비'
      },
      {
        id: 2,
        customerName: '김철수',
        amount: 500000,
        method: '현금',
        date: '2024-07-25',
        status: '완료',
        description: '일반 정비비'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="payment-list">
      <h1>결제 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>고객명</th>
              <th>금액</th>
              <th>결제방법</th>
              <th>결제일</th>
              <th>상태</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.customerName}</td>
                <td>{payment.amount.toLocaleString()}원</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
                <td>{payment.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList; 