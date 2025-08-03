import React, { useState, useEffect } from 'react';
import Calendar, { Value } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apiClient from '../config/api';
import './MySchedule.css';

interface Schedule {
  id: number;
  date: string;
  title: string;
  description: string;
  type: string;
}

const MySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await apiClient.get('/schedules');
      setSchedules(data);
    } catch (error) {
      console.error('일정을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateString);
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const selectedDateSchedules = getSchedulesForDate(selectedDate);

  return (
    <div className="my-schedule">
      <h1>내 일정</h1>
      <div className="schedule-container">
        <div className="calendar-section">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={({ date }) => {
              const daySchedules = getSchedulesForDate(date);
              return daySchedules.length > 0 ? (
                <div className="schedule-dot" />
              ) : null;
            }}
          />
        </div>
        <div className="schedule-list">
          <h3>{selectedDate.toLocaleDateString()} 일정</h3>
          {selectedDateSchedules.length === 0 ? (
            <p>해당 날짜에 일정이 없습니다.</p>
          ) : (
            <div className="schedule-items">
              {selectedDateSchedules.map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <h4>{schedule.title}</h4>
                  <p>{schedule.description}</p>
                  <span className="schedule-type">{schedule.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySchedule; 