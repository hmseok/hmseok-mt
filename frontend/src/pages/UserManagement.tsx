import React, { useState, useEffect } from 'react';
import './UserManagement.css';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [allUsersResponse, pendingUsersResponse] = await Promise.all([
        fetch('http://54.180.88.243:8080/api/users'),
        fetch('http://54.180.88.243:8080/api/users/pending')
      ]);

      const allUsers = await allUsersResponse.json();
      const pendingUsers = await pendingUsersResponse.json();

      setUsers(allUsers);
      setPendingUsers(pendingUsers);
    } catch (err) {
      setError('사용자 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('사용자가 승인되었습니다');
        fetchUsers(); // 목록 새로고침
      } else {
        alert('사용자 승인에 실패했습니다');
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다');
    }
  };

  const handleSuspendUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 정지하시겠습니까?')) return;

    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('사용자가 정지되었습니다');
        fetchUsers(); // 목록 새로고침
      } else {
        alert('사용자 정지에 실패했습니다');
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('사용자가 삭제되었습니다');
        fetchUsers(); // 목록 새로고침
      } else {
        alert('사용자 삭제에 실패했습니다');
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'orange';
      case 'SUSPENDED': return 'red';
      case 'DELETED': return 'gray';
      default: return 'gray';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return '관리자';
      case 'EMPLOYEE': return '임직원';
      case 'PARTNER': return '거래처';
      case 'SUPPLIER': return '협력업체';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return <div className="loading">사용자 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const currentUsers = activeTab === 'all' ? users : pendingUsers;

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>👥 사용자 관리</h1>
        <p>시스템 사용자 계정을 관리합니다</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>총 사용자</h3>
          <p>{users.length}명</p>
        </div>
        <div className="stat-card">
          <h3>승인 대기</h3>
          <p>{pendingUsers.length}명</p>
        </div>
        <div className="stat-card">
          <h3>활성 사용자</h3>
          <p>{users.filter(u => u.status === 'ACTIVE').length}명</p>
        </div>
      </div>

      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체 사용자 ({users.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          승인 대기 ({pendingUsers.length})
        </button>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>사용자명</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>역할</th>
              <th>상태</th>
              <th>가입일</th>
              <th>마지막 로그인</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber || '-'}</td>
                <td>{getRoleDisplayName(user.role)}</td>
                <td>
                  <span className={`status-badge status-${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>
                  <div className="action-buttons">
                    {user.status === 'PENDING' && (
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="approve-button"
                      >
                        승인
                      </button>
                    )}
                    {user.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className="suspend-button"
                      >
                        정지
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-button"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 