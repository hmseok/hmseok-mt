import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CarList.css';

interface Car {
  id: number;
  customer: {
    id: number;
    name: string;
    phone: string;
    insurance: string;
  };
  number: string;
  model: string;
  year: number;
}

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars');
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('차량 데이터 로딩 실패:', error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 형식 검증
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadMessage('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/excel/upload-cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadMessage(`업로드 성공! ${response.data.uploadedCount}개의 차량이 추가되었습니다.`);
      
      // 차량 목록 새로고침
      await fetchCars();
      
    } catch (error: any) {
      setUploadMessage(`업로드 실패: ${error.response?.data || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('/api/excel/template/cars');
      console.log('템플릿 정보:', response.data);
      
      // 실제 템플릿 파일 다운로드 기능은 백엔드에서 구현 필요
      setUploadMessage('템플릿 다운로드 기능은 준비 중입니다.');
    } catch (error) {
      setUploadMessage('템플릿 다운로드 실패');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="car-list">
      <h1>차량 관리</h1>
      
      {/* 엑셀 업로드 섹션 */}
      <div className="excel-upload-section">
        <h3>엑셀 파일 업로드</h3>
        <div className="upload-controls">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
            id="excel-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="excel-upload" className="upload-button">
            {uploading ? '업로드 중...' : '엑셀 파일 선택'}
          </label>
          <button onClick={downloadTemplate} className="template-button">
            템플릿 다운로드
          </button>
        </div>
        
        {uploadMessage && (
          <div className={`upload-message ${uploadMessage.includes('성공') ? 'success' : 'error'}`}>
            {uploadMessage}
          </div>
        )}
        
        <div className="template-info">
          <h4>엑셀 파일 형식</h4>
          <p>첫 번째 행은 헤더로 사용됩니다.</p>
          <table className="template-table">
            <thead>
              <tr>
                <th>고객명</th>
                <th>차량번호</th>
                <th>차량모델</th>
                <th>연도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>홍길동</td>
                <td>12가 3456</td>
                <td>그랜저</td>
                <td>2020</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 차량 목록 */}
      <div className="table-container">
        <h3>차량 목록 ({cars.length}대)</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>고객명</th>
              <th>차량번호</th>
              <th>차량모델</th>
              <th>연도</th>
              <th>고객전화</th>
              <th>보험사</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.customer.name}</td>
                <td>{car.number}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.customer.phone}</td>
                <td>{car.customer.insurance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList; 