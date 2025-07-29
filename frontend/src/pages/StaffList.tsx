import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffList.css';

interface Staff {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  hireDate: string;
  status: string;
}

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API가 구현되면 여기서 데이터를 가져옵니다
    setStaff([
      {
        id: 1,
        name: '김철수',
        position: '정비사',
        phone: '010-1234-5678',
        email: 'kim@example.com',
        hireDate: '2023-01-15',
        status: '재직중'
      },
      {
        id: 2,
        name: '이영희',
        position: '견적사',
        phone: '010-2345-6789',
        email: 'lee@example.com',
        hireDate: '2023-03-20',
        status: '재직중'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="staff-list">
      <h1>직원 관리</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>직책</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>입사일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember.id}>
                <td>{staffMember.id}</td>
                <td>{staffMember.name}</td>
                <td>{staffMember.position}</td>
                <td>{staffMember.phone}</td>
                <td>{staffMember.email}</td>
                <td>{staffMember.hireDate}</td>
                <td>{staffMember.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList; 