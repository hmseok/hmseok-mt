import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import './CustomerList.css';

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.log('인증되지 않은 사용자 - 로그인 페이지로 리다이렉트');
      navigate('/login');
      return;
    }
    
    console.log('인증된 사용자 - 고객 관리 페이지 접근 허용');
  }, [navigate]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiClient.get('/customers');
        setCustomers(data);
      } catch (error) {
        console.error('고객 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="customer-list">로딩 중...</div>;
  }

  return (
    <div className="customer-list">
      <h1>고객 관리</h1>
      <div className="customer-grid">
        {customers.map((customer: any) => (
          <div key={customer.id} className="customer-card">
            <h3>{customer.name}</h3>
            <p>전화번호: {customer.phone}</p>
            <p>보험사: {customer.insurance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList; 