# 📁 프로젝트 구조

## 🏗️ 전체 구조

```
hmseok-mt/
├── backend/                 # 백엔드 (Spring Boot)
│   ├── src/                # 소스 코드
│   ├── scripts/            # 백엔드 관련 스크립트
│   ├── config/             # 백엔드 설정
│   └── docs/               # 백엔드 문서
├── frontend/               # 프론트엔드 (React)
│   ├── src/                # 소스 코드
│   ├── public/             # 정적 파일
│   ├── dist/               # 빌드 결과물
│   ├── config/             # 프론트엔드 설정
│   ├── scripts/            # 프론트엔드 스크립트
│   └── docs/               # 프론트엔드 문서
├── deployment/             # 배포 관련
│   ├── scripts/            # 배포 스크립트
│   ├── config/             # 배포 설정 (Nginx, Docker)
│   ├── docs/               # 배포 문서
│   └── static/             # 배포용 정적 파일
├── scripts/                # 유틸리티 스크립트
│   ├── dns/                # DNS 관련
│   ├── security/           # 보안 관련
│   └── utils/              # 기타 유틸리티
└── README.md               # 프로젝트 메인 문서
```

## 📋 상세 설명

### 🔧 Backend
- **src/**: Spring Boot 소스 코드
- **scripts/**: `start-backend.sh`, `create_tables.sql`
- **docs/**: `AWS_RDS_SETUP.md`

### 🎨 Frontend  
- **src/**: React 소스 코드
- **public/**: 정적 파일 (index.html)
- **dist/**: 빌드된 파일들
- **config/**: `nginx.conf`, `Dockerfile`, `webpack.config.js`

### 🚀 Deployment
- **scripts/**: 모든 배포 스크립트 (`deploy-*.sh`, `setup-*.sh`)
- **config/**: `nginx-*.conf`, `docker-compose.yml`, `Dockerfile`
- **docs/**: 배포 가이드 문서들
- **static/**: 배포용 JAR 파일과 정적 파일들

### 🛠️ Scripts
- **dns/**: DNS 확인 스크립트
- **security/**: 보안 그룹 테스트 스크립트
- **utils/**: 기타 유틸리티 스크립트

## 📝 주요 파일들

### 배포 스크립트
- `deployment/scripts/deploy-app.sh` - 메인 배포 스크립트
- `deployment/scripts/setup-new-server.sh` - 서버 초기 설정
- `deployment/scripts/start-backend.sh` - 백엔드 시작

### 설정 파일
- `deployment/config/nginx-fixed.conf` - Nginx 설정
- `deployment/config/docker-compose.yml` - Docker 설정
- `frontend/config/webpack.config.js` - Webpack 설정

### 문서
- `deployment/docs/` - 모든 배포 관련 문서
- `backend/docs/` - 백엔드 관련 문서
- `README.md` - 프로젝트 메인 문서

## 🎯 사용법

### 개발
```bash
# 백엔드 실행
cd backend
./gradlew bootRun

# 프론트엔드 실행  
cd frontend
npm start
```

### 배포
```bash
# 전체 배포
./deployment/scripts/deploy-app.sh

# 새 서버 설정
./deployment/scripts/setup-new-server.sh
```

### 유틸리티
```bash
# DNS 확인
./scripts/dns/dns-check-commands.sh

# 보안 그룹 테스트
./scripts/security/security-group-test.sh
``` 