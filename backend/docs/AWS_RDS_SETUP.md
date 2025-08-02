# AWS RDS MySQL 설정 가이드

## 1. AWS RDS 인스턴스 생성

### 1.1 AWS 콘솔에서 RDS 생성
1. AWS 콘솔 로그인
2. RDS 서비스 선택
3. "데이터베이스 생성" 클릭

### 1.2 데이터베이스 설정
- **엔진 유형**: MySQL
- **버전**: 8.0.35 (최신 안정 버전)
- **템플릿**: 개발/테스트 (무료 티어)
- **DB 인스턴스 식별자**: `car-repair-db`
- **마스터 사용자명**: `admin`
- **마스터 암호**: `복잡한비밀번호설정`

### 1.3 인스턴스 설정
- **DB 인스턴스 클래스**: db.t3.micro (무료 티어)
- **스토리지**: 20 GB (범용 SSD)
- **스토리지 자동 확장**: 비활성화

### 1.4 연결 설정
- **퍼블릭 액세스**: 예
- **VPC 보안 그룹**: 새로 생성
- **가용 영역**: 기본값
- **데이터베이스 포트**: 3306

### 1.5 데이터베이스 인증
- **데이터베이스 인증 옵션**: MySQL 네이티브 암호 인증

## 2. 보안 그룹 설정

### 2.1 인바운드 규칙 추가
- **유형**: MySQL/Aurora
- **포트**: 3306
- **소스**: 0.0.0.0/0 (모든 IP 허용 - 개발용)

## 3. 데이터베이스 연결 정보

### 3.1 연결 엔드포인트 확인
RDS 인스턴스 생성 후 엔드포인트 주소를 확인하세요.

### 3.2 환경 변수 설정
```bash
export DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
export DB_PORT=3306
export DB_NAME=accident_local
export DB_USERNAME=admin
export DB_PASSWORD=your-password
```

## 4. 애플리케이션 실행

### 4.1 로컬 환경
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 4.2 프로덕션 환경
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=prod'
```

## 5. 데이터베이스 초기화

### 5.1 MySQL 클라이언트로 연결
```bash
mysql -h your-rds-endpoint -u admin -p
```

### 5.2 데이터베이스 생성
```sql
CREATE DATABASE accident_local;
USE accident_local;
```

### 5.3 테이블 생성 (선택사항)
Spring Boot의 `ddl-auto=update` 설정으로 자동 생성됩니다.

## 6. 연결 테스트

### 6.1 애플리케이션 테스트
```bash
curl http://localhost:8080/api/cars
```

### 6.2 데이터베이스 직접 연결 테스트
```bash
mysql -h your-rds-endpoint -u admin -p accident_local
```

## 7. 보안 고려사항

### 7.1 프로덕션 환경
- 보안 그룹에서 특정 IP만 허용
- SSL 연결 활성화
- 강력한 비밀번호 사용
- 정기적인 백업 설정

### 7.2 비용 최적화
- 개발 완료 후 인스턴스 중지
- 사용하지 않는 리소스 삭제
- 비용 알림 설정

## 8. 문제 해결

### 8.1 연결 오류
- 보안 그룹 설정 확인
- 엔드포인트 주소 확인
- 사용자명/비밀번호 확인

### 8.2 성능 이슈
- 인스턴스 클래스 업그레이드
- 연결 풀 설정 조정
- 쿼리 최적화 