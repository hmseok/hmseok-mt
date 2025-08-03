import React, { useState, useEffect } from 'react';
import './DevelopmentLog.css';

interface DevelopmentLog {
  id: number;
  date: string;
  title: string;
  content: string;
  category: string;
  status: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

interface LogForm {
  title: string;
  content: string;
  category: string;
  status: string;
  author: string;
}

const DevelopmentLog: React.FC = () => {
  const [logs, setLogs] = useState<DevelopmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<DevelopmentLog | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [stats, setStats] = useState<any>({});

  const [form, setForm] = useState<LogForm>({
    title: '',
    content: '',
    category: '',
    status: '',
    author: ''
  });

  const categories = ['기능개발', '버그수정', 'UI개선', '성능최적화', '보안강화', '배포', '기타'];
  const statuses = ['계획', '진행중', '완료', '보류', '취소'];

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://hmseok.com/api/development-logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('개발 로그 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('https://hmseok.com/api/development-logs/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingLog 
        ? `https://hmseok.com/api/development-logs/${editingLog.id}`
        : 'https://hmseok.com/api/development-logs';
      
      const method = editingLog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingLog(null);
        resetForm();
        fetchLogs();
        fetchStats();
      }
    } catch (error) {
      console.error('개발 로그 저장 실패:', error);
    }
  };

  const handleEdit = (log: DevelopmentLog) => {
    setEditingLog(log);
    setForm({
      title: log.title,
      content: log.content,
      category: log.category,
      status: log.status,
      author: log.author
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`https://hmseok.com/api/development-logs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLogs();
        fetchStats();
      }
    } catch (error) {
      console.error('개발 로그 삭제 실패:', error);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      category: '',
      status: '',
      author: ''
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesKeyword = !searchKeyword || 
      log.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.content.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesCategory = !selectedCategory || log.category === selectedCategory;
    const matchesStatus = !selectedStatus || log.status === selectedStatus;
    
    return matchesKeyword && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'success';
      case '진행중': return 'warning';
      case '계획': return 'info';
      case '보류': return 'secondary';
      case '취소': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="development-log">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="development-log">
      <div className="log-header">
        <h1>📝 개발 기록 관리</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingLog(null);
            resetForm();
          }}
        >
          + 새 기록 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">전체 기록</div>
          <div className="stat-value">{stats.totalLogs || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">완료</div>
          <div className="stat-value success">{stats.completedLogs || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">진행중</div>
          <div className="stat-value warning">{stats.inProgressLogs || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">계획</div>
          <div className="stat-value info">{stats.plannedLogs || 0}</div>
        </div>
      </div>

      {/* 필터 */}
      <div className="filter-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="키워드 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
          >
            <option value="">모든 카테고리</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input"
          >
            <option value="">모든 상태</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 기록 목록 */}
      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <p>개발 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="logs-grid">
            {filteredLogs.map(log => (
              <div key={log.id} className="log-card">
                <div className="log-header">
                  <h3>{log.title}</h3>
                  <div className="log-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(log)}
                    >
                      수정
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(log.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="log-content">
                  <p>{log.content}</p>
                </div>
                <div className="log-meta">
                  <span className={`badge badge-${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                  <span className="badge badge-secondary">{log.category}</span>
                  <span className="log-author">작성자: {log.author}</span>
                  <span className="log-date">{formatDate(log.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 기록 추가/수정 폼 */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingLog ? '기록 수정' : '새 기록 추가'}</h2>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingLog(null);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="log-form">
              <div className="form-group">
                <label className="form-label">제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  className="form-input"
                  rows={5}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">카테고리</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">선택하세요</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">상태</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">선택하세요</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">작성자</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({...form, author: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingLog ? '수정' : '추가'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLog(null);
                    resetForm();
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentLog; 