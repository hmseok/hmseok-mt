import React, { useState, useEffect } from 'react';
import './PartnerList.css';

interface Partner {
  id: number;
  name: string;
  type: string;
  contact: string;
  phone: string;
  address: string;
  status: string;
}

const PartnerList: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPartners([
      {
        id: 1,
        name: 'A부품공급업체',
        type: '부품공급',
        contact: '김대표',
        phone: '02-1234-5678',
        address: '서울시 강남구',
        status: '활성'
      },
      {
        id: 2,
        name: 'B렌터카업체',
        type: '렌터카',
        contact: '이대표',
        phone: '02-2345-6789',
        address: '서울시 서초구',
        status: '활성'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="partner-list">
      <h1>협력업체 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>업체명</th>
              <th>업종</th>
              <th>담당자</th>
              <th>전화번호</th>
              <th>주소</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>{partner.id}</td>
                <td>{partner.name}</td>
                <td>{partner.type}</td>
                <td>{partner.contact}</td>
                <td>{partner.phone}</td>
                <td>{partner.address}</td>
                <td>{partner.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerList; 