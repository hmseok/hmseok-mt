# 자동차 정비 관리 시스템 (Car Repair Management System)

## 📋 프로젝트 개요

Spring Boot + React + MySQL을 사용한 자동차 정비 관리 시스템입니다.
엑셀 파일 업로드 기능과 스케줄 관리 기능을 포함합니다.

## 🚀 주요 기능

### 백엔드 (Spring Boot)
- **고객 관리**: 고객 정보 CRUD
- **차량 관리**: 차량 정보 CRUD + 엑셀 업로드
- **사고 관리**: 사고 정보 관리
- **견적 관리**: 견적 정보 관리
- **정비 관리**: 정비 작업 관리
- **회계 관리**: 수입/지출 관리
- **스케줄 관리**: 업무 일정 관리
- **투두 관리**: 할일 관리
- **엑셀 업로드**: 차량 정보 일괄 업로드

### 프론트엔드 (React)
- **반응형 UI**: 모던한 사용자 인터페이스
- **캘린더 뷰**: 스케줄 캘린더 표시
- **필터링**: 담당자, 상태, 업무종류별 필터
- **실시간 데이터**: 백엔드 API 연동

## 🛠 기술 스택

### 백엔드
- **Java 17**
- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **MySQL 8.0**
- **Apache POI** (엑셀 처리)
- **Gradle**

### 프론트엔드
- **React 18**
- **TypeScript**
- **Webpack**
- **Axios**
- **React Router DOM**
- **react-calendar**

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd auto-repair-management
```

### 2. 백엔드 실행

#### 로컬 MySQL 사용
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

#### AWS RDS 사용
```bash
# 환경 변수 설정
export DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
export DB_PORT=3306
export DB_NAME=accident_local
export DB_USERNAME=admin
export DB_PASSWORD=your-password

# 애플리케이션 실행
cd backend
./gradlew bootRun --args='--spring.profiles.active=prod'
```

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### 4. 브라우저 접속
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080

## 📊 데이터베이스 설정

### 로컬 MySQL 설정
```sql
CREATE DATABASE accident_local;
CREATE USER 'hmseok'@'localhost' IDENTIFIED BY '!homin1019';
GRANT ALL PRIVILEGES ON accident_local.* TO 'hmseok'@'localhost';
FLUSH PRIVILEGES;
```

### AWS RDS 설정
자세한 설정 방법은 [AWS_RDS_SETUP.md](./AWS_RDS_SETUP.md)를 참조하세요.

## 📁 프로젝트 구조

```
auto-repair-management/
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/example/carrepair/
│   │       ├── controller/  # REST API 컨트롤러
│   │       ├── domain/      # JPA 엔티티
│   │       ├── repository/  # 데이터 액세스 레이어
│   │       └── service/     # 비즈니스 로직
│   └── src/main/resources/
│       ├── application.properties
│       ├── application-local.properties
│       └── application-prod.properties
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   └── App.tsx         # 메인 앱 컴포넌트
│   └── public/
└── README.md
```

## 🔧 API 엔드포인트

### 기본 CRUD API
- `GET /api/customers` - 고객 목록
- `GET /api/cars` - 차량 목록
- `GET /api/accidents` - 사고 목록
- `GET /api/estimates` - 견적 목록
- `GET /api/repairs` - 정비 목록
- `GET /api/accounting` - 회계 목록

### 스케줄 관리 API
- `GET /api/schedules` - 스케줄 목록
- `GET /api/todos` - 투두 목록

### 엑셀 업로드 API
- `POST /api/excel/upload-cars` - 차량 정보 엑셀 업로드
- `GET /api/excel/template/cars` - 엑셀 템플릿 정보

## 📋 엑셀 업로드 형식

차량 정보 엑셀 파일은 다음 형식을 따라야 합니다:

| 고객명 | 차량번호 | 차량모델 | 연도 |
|--------|----------|----------|------|
| 홍길동 | 12가 3456 | 그랜저 | 2020 |

## 🚀 배포

### 로컬 개발 환경
```bash
# 백엔드
cd backend
./gradlew bootRun

# 프론트엔드
cd frontend
npm start
```

### 프로덕션 환경
```bash
# 백엔드 JAR 빌드
cd backend
./gradlew build
java -jar build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar

# 프론트엔드 빌드
cd frontend
npm run build
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 