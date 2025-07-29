import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import axios from 'axios';
import './MySchedule.css';

interface Schedule {
  id: number;
  title: string;
  type: string;
  relatedId: number;
  relatedPath: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedTo: string;
  priority: string;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
  status: string;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filters, setFilters] = useState({
    assignedTo: '',
    status: '',
    type: ''
  });

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 API 호출
        const [scheduleResponse, todoResponse] = await Promise.all([
          axios.get('/api/schedules'),
          axios.get('/api/todos')
        ]);
        
        setSchedules(scheduleResponse.data);
        setTodos(todoResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // API 호출 실패 시 더미 데이터 사용
        const scheduleData: Schedule[] = [
          {
            id: 1,
            title: '홍길동 사고 견적',
            type: '견적',
            relatedId: 1,
            relatedPath: '/estimates',
            startDate: '2024-07-29',
            endDate: '2024-07-30',
            status: '진행중',
            assignedTo: '김철수',
            priority: '높음'
          },
          {
            id: 2,
            title: '김철수 차량 정비',
            type: '정비',
            relatedId: 2,
            relatedPath: '/repairs',
            startDate: '2024-07-30',
            endDate: '2024-07-31',
            status: '예정',
            assignedTo: '이영희',
            priority: '보통'
          },
          {
            id: 3,
            title: '회계 정산',
            type: '회계',
            relatedId: 1,
            relatedPath: '/accounting',
            startDate: '2024-07-31',
            endDate: '2024-08-01',
            status: '예정',
            assignedTo: '김철수',
            priority: '높음'
          }
        ];

        const todoData: Todo[] = [
          {
            id: 1,
            title: '홍길동 차량 정비 완료',
            description: '후방 범퍼 교체 작업 완료 확인',
            assignedTo: '김철수',
            dueDate: '2024-07-30',
            priority: '높음',
            status: '진행중'
          },
          {
            id: 2,
            title: '부품 재고 확인',
            description: '엔진오일 재고량 점검',
            assignedTo: '이영희',
            dueDate: '2024-07-28',
            priority: '보통',
            status: '완료'
          }
        ];

        setSchedules(scheduleData);
        setTodos(todoData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필터링된 데이터
  const filteredSchedules = schedules.filter(schedule => {
    if (filters.assignedTo && schedule.assignedTo !== filters.assignedTo) return false;
    if (filters.status && schedule.status !== filters.status) return false;
    if (filters.type && schedule.type !== filters.type) return false;
    return true;
  });

  const filteredTodos = todos.filter(todo => {
    if (filters.assignedTo && todo.assignedTo !== filters.assignedTo) return false;
    if (filters.status && todo.status !== filters.status) return false;
    return true;
  });

  // 캘린더 타일 렌더링
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const daySchedules = schedules.filter(s => 
      s.startDate <= dateStr && s.endDate >= dateStr
    );
    const dayTodos = todos.filter(t => t.dueDate === dateStr);

    return (
      <div className="calendar-tile">
        {daySchedules.length > 0 && (
          <div className="schedule-indicator" title={`${daySchedules.length}개 일정`}>
            📅
          </div>
        )}
        {dayTodos.length > 0 && (
          <div className="todo-indicator" title={`${dayTodos.length}개 할일`}>
            ✅
          </div>
        )}
      </div>
    );
  };

  // 날짜 클릭 시 해당 날짜의 일정 표시
  const handleDateClick = (value: Value) => {
    setSelectedDate(value);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="my-schedule">
      <h1>나의 스케줄</h1>
      
      {/* 필터 섹션 */}
      <div className="filters">
        <div className="filter-group">
          <label>담당자:</label>
          <select 
            value={filters.assignedTo} 
            onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
          >
            <option value="">전체</option>
            <option value="김철수">김철수</option>
            <option value="이영희">이영희</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>상태:</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">전체</option>
            <option value="예정">예정</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>업무종류:</label>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">전체</option>
            <option value="견적">견적</option>
            <option value="정비">정비</option>
            <option value="회계">회계</option>
          </select>
        </div>
      </div>

      {/* 뷰 모드 선택 */}
      <div className="view-controls">
        <button 
          className={viewMode === 'calendar' ? 'active' : ''} 
          onClick={() => setViewMode('calendar')}
        >
          캘린더 보기
        </button>
        <button 
          className={viewMode === 'list' ? 'active' : ''} 
          onClick={() => setViewMode('list')}
        >
          리스트 보기
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-view">
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileContent={tileContent}
            className="schedule-calendar"
          />
          
          {/* 선택된 날짜의 일정 */}
          {selectedDate && (
            <div className="selected-date-schedules">
              <h3>{format(selectedDate as Date, 'yyyy년 MM월 dd일')} 일정</h3>
              <div className="schedule-list">
                {schedules
                  .filter(s => {
                    const dateStr = format(selectedDate as Date, 'yyyy-MM-dd');
                    return s.startDate <= dateStr && s.endDate >= dateStr;
                  })
                  .map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                      <span className="schedule-type">{schedule.type}</span>
                      <span className="schedule-title">{schedule.title}</span>
                      <span className="schedule-status">{schedule.status}</span>
                      <Link to={schedule.relatedPath} className="schedule-link">
                        상세보기
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="list-view">
          {/* 스케줄 리스트 */}
          <div className="schedule-section">
            <h2>일정 목록</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>업무명</th>
                    <th>업무종류</th>
                    <th>담당자</th>
                    <th>시작일</th>
                    <th>마감일</th>
                    <th>상태</th>
                    <th>우선순위</th>
                    <th>관련 업무</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.type}</td>
                      <td>{item.assignedTo}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>{item.status}</td>
                      <td>{item.priority}</td>
                      <td>
                        <Link to={`${item.relatedPath}`}>{item.type} 상세</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 투두 리스트 */}
          <div className="todo-section">
            <h2>할일 목록</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>설명</th>
                    <th>담당자</th>
                    <th>마감일</th>
                    <th>우선순위</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTodos.map((todo) => (
                    <tr key={todo.id}>
                      <td>{todo.id}</td>
                      <td>{todo.title}</td>
                      <td>{todo.description}</td>
                      <td>{todo.assignedTo}</td>
                      <td>{todo.dueDate}</td>
                      <td>{todo.priority}</td>
                      <td>{todo.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule; 