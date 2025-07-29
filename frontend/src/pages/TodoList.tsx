import React, { useState, useEffect } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
  status: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTodos([
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
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="todo-list">
      <h1>할일 관리</h1>
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
            {todos.map((todo) => (
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
  );
};

export default TodoList; 