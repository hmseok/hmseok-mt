# Hmseok 업무 관리 시스템

## 📋 프로젝트 개요

Hmseok 업무 관리 시스템은 차량 정비, 사고 처리, 고객 관리 등을 통합적으로 관리할 수 있는 웹 애플리케이션입니다.

## 🚀 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Webpack** - 모듈 번들링
- **CSS3** - 반응형 디자인

### Backend
- **Spring Boot 3.5.3** - 서버 애플리케이션
- **Java 21** - 프로그래밍 언어
- **Gradle** - 빌드 도구
- **Spring Security** - 인증 및 권한 관리
- **JPA/Hibernate** - 데이터베이스 ORM
- **MySQL** - 데이터베이스

### Infrastructure
- **AWS EC2** - 서버 호스팅
- **AWS RDS** - 데이터베이스 호스팅
- **Nginx** - 웹 서버 및 프록시
- **Let's Encrypt** - SSL 인증서

## 🏗️ 프로젝트 구조

```
hmseok-mt/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── config/         # 설정 파일
│   │   └── ...
│   ├── public/             # 정적 파일
│   └── package.json
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/example/carrepair/
│   │       ├── controller/ # REST API 컨트롤러
│   │       ├── service/    # 비즈니스 로직
│   │       ├── repository/ # 데이터 액세스
│   │       ├── domain/     # 엔티티 클래스
│   │       ├── dto/        # 데이터 전송 객체
│   │       └── config/     # 설정 클래스
│   └── build.gradle
└── deployment/             # 배포 관련 파일
```

## 🛠️ 개발 환경 설정

### Prerequisites
- Node.js 18+
- Java 21
- MySQL 8.0+

### Frontend 개발 서버 실행
```bash
cd frontend
npm install
npm start
```

### Backend 개발 서버 실행
```bash
cd backend
./gradlew bootRun
```

### 데이터베이스 설정
1. MySQL 서버 실행
2. `application.properties`에서 데이터베이스 연결 정보 설정

## 📱 주요 기능

### 🔐 인증 시스템
- 로그인/로그아웃
- 회원가입
- 아이디 찾기
- 비밀번호 찾기

### 👥 사용자 관리
- 사용자 목록 조회
- 사용자 상태 관리 (활성화/비활성화)
- 역할 기반 권한 관리

### 🚗 차량 관리
- 차량 정보 등록/수정/삭제
- 장기렌터카 실행데이터 관리
- 차량 상태 추적

### 👤 고객 관리
- 고객 정보 등록/수정/삭제
- 고객 이력 관리
- 고객 담당자 할당

### 🚨 사고 관리
- 사고 정보 등록/수정/삭제
- 사고 처리 상태 추적
- 사고 관련 문서 관리

### 💰 견적 관리
- 견적서 작성/수정/삭제
- 견적 승인 프로세스
- 견적 이력 관리

### 🔧 정비 관리
- 정비 작업 등록/수정/삭제
- 정비 상태 추적
- 정비 이력 관리

### 💼 회계 관리
- 수입/지출 관리
- 정기 결산
- 재무 보고서

### 📅 일정 관리
- 개인 일정 관리
- 팀 일정 공유
- 일정 알림

## 🚀 배포

### 개발 환경
```bash
# Frontend 빌드
cd frontend
npm run build

# Backend 빌드
cd backend
./gradlew clean build

# 서버 배포
scp build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ubuntu@your-server:/home/ubuntu/
ssh ubuntu@your-server "sudo systemctl restart car-repair.service"
```

### 프로덕션 환경
- **도메인**: https://hmseok.com
- **서버**: AWS EC2
- **데이터베이스**: AWS RDS MySQL
- **SSL**: Let's Encrypt

## 🔧 개발 가이드

### 코드 스타일
- **Frontend**: ESLint + Prettier
- **Backend**: Google Java Style Guide

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

## 📞 문의

프로젝트 관련 문의사항이 있으시면 언제든지 연락주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 