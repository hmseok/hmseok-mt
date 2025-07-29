# Car Repair Management System

자동차 수리 관리 시스템 - 고객, 차량, 사고, 견적, 정비, 스케줄, 할일 관리를 위한 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 로컬 개발 환경

```bash
# 백엔드 실행
cd backend
./gradlew bootRun

# 프론트엔드 실행 (새 터미널)
cd frontend
npm start
```

### Docker를 사용한 배포

```bash
# 전체 애플리케이션 배포
./deploy.sh

# 또는 수동으로
docker-compose up -d
```

## 🌐 도메인 연동 옵션

### 1. GitHub Pages 배포
```bash
cd frontend
npm run deploy
```
- URL: `https://hmseok.github.io/car-repair-management`

### 2. Netlify 배포
1. Netlify에 GitHub 저장소 연결
2. Build command: `npm run build`
3. Publish directory: `dist`
4. 환경 변수 설정: `REACT_APP_API_URL=https://api.carrepair.hmseok.com`

### 3. Vercel 배포
```bash
npm install -g vercel
vercel
```

### 4. AWS EC2 배포
```bash
# EC2 인스턴스에서 실행
git clone <repository>
cd auto-repair-management
./deploy.sh
```

## 🔧 환경 설정

### 백엔드 설정 (application.properties)
```properties
# AWS RDS MySQL 설정
spring.datasource.url=jdbc:mysql://hmseok-mt-db.cp62mcmg4epg.ap-northeast-2.rds.amazonaws.com:3306/accident_local
spring.datasource.username=admin
spring.datasource.password=Homin3231
```

### 프론트엔드 설정 (src/config/api.ts)
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.carrepair.hmseok.com'
    : 'http://localhost:8080');
```

## 📁 프로젝트 구조

```
auto-repair-management/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   ├── build.gradle
│   └── Dockerfile
├── frontend/               # React TypeScript 프론트엔드
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # 전체 애플리케이션
├── nginx.conf             # Nginx 설정
└── deploy.sh              # 배포 스크립트
```

## 🔌 API 엔드포인트

- `GET /api/customers` - 고객 목록
- `GET /api/cars` - 차량 목록
- `GET /api/accidents` - 사고 목록
- `GET /api/estimates` - 견적 목록
- `GET /api/repairs` - 정비 목록
- `GET /api/schedules` - 스케줄 목록
- `GET /api/todos` - 할일 목록

## 🌍 도메인 설정

### DNS 설정 예시
```
A     carrepair.hmseok.com     → EC2 IP 주소
CNAME api.carrepair.hmseok.com → carrepair.hmseok.com
```

### SSL 인증서 설정
```bash
# Let's Encrypt 사용
sudo certbot --nginx -d carrepair.hmseok.com
```

## 🐳 Docker 명령어

```bash
# 전체 애플리케이션 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 컨테이너 중지
docker-compose down

# 이미지 재빌드
docker-compose build --no-cache
```

## 📊 모니터링

- **애플리케이션**: `http://localhost`
- **API 문서**: `http://localhost/api`
- **H2 콘솔**: `http://localhost/h2-console`
- **데이터베이스**: AWS RDS MySQL

## 🔒 보안 설정

1. **환경 변수 사용**
```bash
export SPRING_DATASOURCE_PASSWORD=your_secure_password
```

2. **HTTPS 강제 적용**
```nginx
# nginx.conf에서 HTTP → HTTPS 리다이렉트
return 301 https://$server_name$request_uri;
```

3. **CORS 설정**
```java
@CrossOrigin(origins = {"https://carrepair.hmseok.com"})
```

## 🚀 배포 체크리스트

- [ ] 도메인 DNS 설정 완료
- [ ] SSL 인증서 설치
- [ ] 환경 변수 설정
- [ ] 데이터베이스 연결 확인
- [ ] API 엔드포인트 테스트
- [ ] 프론트엔드 빌드 확인
- [ ] 로드 밸런서 설정 (선택사항)
- [ ] 모니터링 도구 설정 (선택사항)

## 📞 지원

문제가 발생하면 이슈를 등록해주세요. 