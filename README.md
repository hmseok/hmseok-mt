# Hmseok 업무 관리 시스템

자동차 정비 업무를 위한 종합 관리 시스템입니다.

## 📁 프로젝트 구조

```
hmseok-mt/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/carrepair/
│   │   │   │       ├── controller/     # REST API 컨트롤러
│   │   │   │       ├── service/        # 비즈니스 로직
│   │   │   │       ├── repository/     # 데이터 액세스
│   │   │   │       ├── domain/         # 엔티티 클래스
│   │   │   │       ├── dto/            # 데이터 전송 객체
│   │   │   │       ├── config/         # 설정 클래스
│   │   │   │       └── security/       # 보안 설정
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── build.gradle
│   └── Dockerfile
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── config/        # 설정 파일
│   │   └── index.tsx      # 앱 진입점
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── scripts/               # 배포 및 유틸리티 스크립트
│   └── deployment/       # 서버 배포 관련 스크립트
├── docs/                 # 문서
└── .gitignore
```

## 🚀 주요 기능

### 백엔드 (Spring Boot)
- **사용자 관리**: 회원가입, 로그인, 권한 관리
- **고객 관리**: 고객 정보 CRUD
- **차량 관리**: 차량 정보 관리
- **사고 관리**: 사고 접수 및 처리
- **견적 관리**: 수리 견적 작성
- **정비 관리**: 정비 작업 관리
- **회계 관리**: 수입/지출 관리
- **스케줄 관리**: 작업 일정 관리

### 프론트엔드 (React)
- **반응형 UI**: 모바일/태블릿/데스크톱 지원
- **유튜브 스타일 네비게이션**: 직관적인 메뉴 구조
- **실시간 데이터**: 실시간 업데이트
- **사용자 친화적**: 직관적인 사용자 인터페이스

## 🛠 기술 스택

### 백엔드
- **Java 21**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **JWT 인증**

### 프론트엔드
- **React 18**
- **TypeScript**
- **React Router**
- **Webpack**
- **CSS3**

### 인프라
- **AWS EC2**
- **AWS RDS**
- **Nginx**
- **SSL/TLS**
- **Docker**

## 📋 설치 및 실행

### 1. 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### 3. 프로덕션 빌드
```bash
# 백엔드 빌드
cd backend
./gradlew build

# 프론트엔드 빌드
cd frontend
npm run build
```

## 🌐 배포

### 서버 배포
```bash
# 배포 스크립트 실행
./scripts/deployment/deploy-new-server.sh
```

### 도메인 설정
- **도메인**: hmseok.com
- **SSL**: Let's Encrypt 자동 갱신
- **CDN**: CloudFront (선택사항)

## 🔧 개발 환경 설정

### 필수 요구사항
- Java 21
- Node.js 18+
- MySQL 8.0
- Git

### 환경 변수
```bash
# 백엔드
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/carrepair
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# 프론트엔드
REACT_APP_API_URL=http://localhost:8080/api
```

## 📊 데이터베이스 스키마

### 주요 테이블
- `users`: 사용자 정보
- `customers`: 고객 정보
- `cars`: 차량 정보
- `accidents`: 사고 정보
- `estimates`: 견적 정보
- `repairs`: 정비 정보
- `accountings`: 회계 정보
- `schedules`: 스케줄 정보

## 🔒 보안

### 인증
- JWT 토큰 기반 인증
- Spring Security 설정
- CORS 정책 적용

### 권한 관리
- **ADMIN**: 시스템 관리자
- **EMPLOYEE**: 일반 직원
- **USER**: 일반 사용자

## 📱 반응형 디자인

### 지원 디바이스
- **모바일**: 320px ~ 768px
- **태블릿**: 769px ~ 1024px
- **데스크톱**: 1025px 이상

### 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 성능 최적화

### 백엔드
- JPA 쿼리 최적화
- 캐싱 전략
- 연결 풀 설정

### 프론트엔드
- 코드 스플리팅
- 이미지 최적화
- 번들 크기 최적화

## 📝 API 문서

### 인증 API
- `POST /api/auth/register`: 회원가입
- `POST /api/auth/login`: 로그인

### 데이터 API
- `GET /api/customers`: 고객 목록
- `GET /api/cars`: 차량 목록
- `GET /api/accidents`: 사고 목록
- `GET /api/estimates`: 견적 목록
- `GET /api/repairs`: 정비 목록
- `GET /api/accountings`: 회계 목록

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

- **이메일**: support@hmseok.com
- **웹사이트**: https://hmseok.com
- **문서**: `/docs` 폴더 참조

---

**Hmseok 업무 관리 시스템** - 효율적인 자동차 정비 업무 관리 솔루션 