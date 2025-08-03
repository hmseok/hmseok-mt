# 🚀 AWS 배포 가이드

## 📦 배포 파일 준비 완료

배포 파일 `car-repair-deploy.zip`이 생성되었습니다. (83MB)

## 🌐 AWS Elastic Beanstalk 배포 방법

### 1. AWS 콘솔 접속
- AWS Management Console에 로그인
- Elastic Beanstalk 서비스로 이동

### 2. 애플리케이션 생성
1. **"새 애플리케이션 생성"** 클릭
2. 애플리케이션 이름: `car-repair-app`
3. 플랫폼: **Java**
4. 플랫폼 브랜치: **Java 21**
5. 플랫폼 버전: **Tomcat 10**

### 3. 환경 생성
1. 환경 이름: `car-repair-prod`
2. 도메인: 자동 생성 또는 커스텀
3. **"애플리케이션 버전 업로드"** 선택
4. `car-repair-deploy.zip` 파일 업로드

### 4. 환경 설정
- **인스턴스 유형**: t3.micro (무료 티어)
- **인스턴스 수**: 1-2개
- **로드 밸런서**: 활성화

### 5. 환경 변수 설정
```
SPRING_PROFILES_ACTIVE=production
JAVA_OPTS=-Xmx512m -Xms256m
```

## 🔧 AWS CLI를 사용한 배포

### 1. AWS CLI 설치 및 설정
```bash
# AWS CLI 설치
brew install awscli

# AWS 자격 증명 설정
aws configure
```

### 2. S3에 배포 파일 업로드
```bash
# S3 버킷 생성
aws s3 mb s3://car-repair-deploy

# 배포 파일 업로드
aws s3 cp car-repair-deploy.zip s3://car-repair-deploy/
```

### 3. Elastic Beanstalk 애플리케이션 생성
```bash
# 애플리케이션 생성
aws elasticbeanstalk create-application \
  --application-name car-repair-app \
  --description "Car Repair Management System"

# 애플리케이션 버전 생성
aws elasticbeanstalk create-application-version \
  --application-name car-repair-app \
  --version-label v1 \
  --source-bundle S3Bucket=car-repair-deploy,S3Key=car-repair-deploy.zip

# 환경 생성
aws elasticbeanstalk create-environment \
  --application-name car-repair-app \
  --environment-name car-repair-prod \
  --solution-stack-name "64bit Amazon Linux 2023 v4.0.1 running Java 21"
```

## 🌐 배포 후 확인

### 1. API 엔드포인트 테스트
```bash
# 애플리케이션 URL 확인
curl -X GET https://your-app-url.elasticbeanstalk.com/api/cars

# 헬스 체크
curl -X GET https://your-app-url.elasticbeanstalk.com/api/users
```

### 2. 프론트엔드 접속
- 브라우저에서 `https://your-app-url.elasticbeanstalk.com` 접속
- 로그인 및 기능 테스트

## 🔄 자동 배포 설정

### GitHub Actions를 사용한 CI/CD

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK 21
      uses: actions/setup-java@v2
      with:
        java-version: '21'
        
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Build and Deploy
      run: |
        ./deploy-aws.sh
        # AWS CLI를 사용한 배포 명령어들
        
    - name: Deploy to Elastic Beanstalk
      uses: einaregilsson/beanstalk-deploy@v21
      with:
        aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        application_name: car-repair-app
        environment_name: car-repair-prod
        version_label: ${{ github.sha }}
        region: ap-northeast-2
        deployment_package: car-repair-deploy.zip
```

## 📊 모니터링 및 로그

### 1. CloudWatch 로그 확인
- Elastic Beanstalk 콘솔에서 로그 확인
- 애플리케이션 로그, 환경 로그, 요청 로그

### 2. 성능 모니터링
- CPU 사용률, 메모리 사용률
- 네트워크 트래픽
- 에러율 및 응답 시간

## 🔒 보안 설정

### 1. HTTPS 설정
- SSL 인증서 설정
- HTTPS 리다이렉션

### 2. 보안 그룹 설정
- 필요한 포트만 열기 (80, 443)
- VPC 설정 확인

## 💰 비용 최적화

### 1. 무료 티어 활용
- t3.micro 인스턴스 사용
- 750시간/월 무료

### 2. 자동 스케일링 설정
- 트래픽에 따른 자동 확장/축소
- 비용 효율적인 리소스 사용

## 🆘 문제 해결

### 1. 배포 실패 시
- 로그 확인
- 환경 변수 설정 확인
- 인스턴스 타입 확인

### 2. 애플리케이션 오류 시
- CloudWatch 로그 확인
- 데이터베이스 연결 확인
- API 엔드포인트 테스트

---

**배포 완료 후 URL**: `https://your-app-url.elasticbeanstalk.com` 