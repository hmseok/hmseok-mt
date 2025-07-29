import React, { useState, useEffect } from 'react';
import './ContractList.css';

interface Contract {
  id: number;
  partnerName: string;
  type: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
}

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setContracts([
      {
        id: 1,
        partnerName: 'A부품공급업체',
        type: '부품공급계약',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        amount: 50000000,
        status: '진행중'
      },
      {
        id: 2,
        partnerName: 'B렌터카업체',
        type: '렌터카계약',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        amount: 20000000,
        status: '진행중'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="contract-list">
      <h1>계약 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>협력업체명</th>
              <th>계약종류</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>계약금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.partnerName}</td>
                <td>{contract.type}</td>
                <td>{contract.startDate}</td>
                <td>{contract.endDate}</td>
                <td>{contract.amount.toLocaleString()}원</td>
                <td>{contract.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractList; 