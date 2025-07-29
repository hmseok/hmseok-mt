import React, { useState, useEffect } from 'react';
import './PartList.css';

interface Part {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  status: string;
}

const PartList: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParts([
      {
        id: 1,
        name: '브레이크 패드',
        category: '제동장치',
        price: 50000,
        stock: 20,
        supplier: 'A부품공급업체',
        status: '재고있음'
      },
      {
        id: 2,
        name: '엔진오일',
        category: '윤활유',
        price: 15000,
        stock: 50,
        supplier: 'B오일공급업체',
        status: '재고있음'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="part-list">
      <h1>부품 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>부품명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>재고</th>
              <th>공급업체</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id}>
                <td>{part.id}</td>
                <td>{part.name}</td>
                <td>{part.category}</td>
                <td>{part.price.toLocaleString()}원</td>
                <td>{part.stock}개</td>
                <td>{part.supplier}</td>
                <td>{part.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartList; 