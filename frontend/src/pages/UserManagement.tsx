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

      if (allUsersResponse.ok) {
        const allUsers = await allUsersResponse.json();
        setUsers(allUsers);
      }

      if (pendingUsersResponse.ok) {
        const pending = await pendingUsersResponse.json();
        setPendingUsers(pending);
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('사용자 승인에 실패했습니다:', error);
    }
  };

  const handleSuspendUser = async (userId: number) => {
    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}/suspend`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('사용자 정지에 실패했습니다:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://54.180.88.243:8080/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('사용자 삭제에 실패했습니다:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ADMIN': '시스템 관리자',
      'EMPLOYEE': '직원',
      'PARTNER': '비즈니스 파트너',
      'SUPPLIER': '협력사'
    };
    return roleMap[role] || role;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      'PENDING': { text: '승인 대기', className: 'status-pending' },
      'ACTIVE': { text: '활성', className: 'status-active' },
      'SUSPENDED': { text: '정지', className: 'status-suspended' },
      'DELETED': { text: '삭제', className: 'status-deleted' }
    };
    const statusInfo = statusMap[status] || { text: status, className: 'status-unknown' };
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1 className="user-management-title">👥 사용자 관리</h1>
        <p className="user-management-subtitle">시스템 사용자들을 관리하고 모니터링합니다</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">전체 사용자</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{pendingUsers.length}</div>
            <div className="stat-label">승인 대기</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.status === 'ACTIVE').length}</div>
            <div className="stat-label">활성 사용자</div>
          </div>
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>사용자명</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>가입일</th>
              <th>마지막 로그인</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'all' ? users : pendingUsers).map((user) => (
              <tr key={user.id} className={!user.isActive ? 'inactive-user' : ''}>
                <td className="user-username">{user.username}</td>
                <td className="user-name">{user.fullName}</td>
                <td className="user-email">{user.email}</td>
                <td className="user-role">
                  <span className="role-badge">{getRoleDisplayName(user.role)}</span>
                </td>
                <td className="user-status">
                  {getStatusBadge(user.status)}
                </td>
                <td className="user-date">{formatDate(user.createdAt)}</td>
                <td className="user-date">{formatDate(user.lastLogin)}</td>
                <td className="user-actions">
                  {user.status === 'PENDING' && (
                    <button
                      className="action-button approve-button"
                      onClick={() => handleApproveUser(user.id)}
                      title="승인"
                    >
                      ✅
                    </button>
                  )}
                  {user.status === 'ACTIVE' && (
                    <button
                      className="action-button suspend-button"
                      onClick={() => handleSuspendUser(user.id)}
                      title="정지"
                    >
                      ⏸️
                    </button>
                  )}
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                    title="삭제"
                  >
                    🗑️
                  </button>
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