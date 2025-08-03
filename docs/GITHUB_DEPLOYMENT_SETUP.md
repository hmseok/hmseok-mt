# GitHub Actions 배포 설정 가이드

## 🚀 GitHub Actions를 사용한 자동 배포 설정

### 1. GitHub Secrets 설정

GitHub 저장소의 Settings → Secrets and variables → Actions에서 다음 시크릿을 추가하세요:

#### 필수 Secrets:
- `EC2_HOST`: EC2 인스턴스의 퍼블릭 IP 주소 (예: 15.164.97.212)
- `EC2_USERNAME`: SSH 사용자명 (예: ubuntu)
- `EC2_SSH_KEY`: EC2 인스턴스 접속용 SSH 프라이빗 키

### 2. SSH 키 설정 방법

#### 2.1 기존 SSH 키 사용
```bash
# 기존 SSH 키를 GitHub Secrets에 추가
cat ~/.ssh/RIDE-EBOT-KR.pem | base64 -w 0
```

#### 2.2 새로운 SSH 키 생성
```bash
# 새로운 SSH 키 생성
ssh-keygen -t rsa -b 4096 -C "github-actions@hmseok.com" -f ~/.ssh/github-actions

# 퍼블릭 키를 EC2 서버에 등록
ssh-copy-id -i ~/.ssh/github-actions.pub ubuntu@15.164.97.212

# 프라이빗 키를 GitHub Secrets에 추가
cat ~/.ssh/github-actions | base64 -w 0
```

### 3. EC2 서버 설정

#### 3.1 배포 스크립트 업로드
```bash
# 배포 스크립트를 EC2 서버에 업로드
scp -i ~/.ssh/RIDE-EBOT-KR.pem scripts/deployment/github-deploy.sh ubuntu@15.164.97.212:/home/ubuntu/scripts/deployment/

# 실행 권한 부여
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "chmod +x /home/ubuntu/scripts/deployment/github-deploy.sh"
```

#### 3.2 디렉토리 구조 확인
```bash
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "ls -la /home/ubuntu/scripts/deployment/"
```

### 4. GitHub Actions 워크플로우

#### 4.1 자동 배포
- `main`, `develop`, `clean-develop` 브랜치에 푸시하면 자동 배포
- 프론트엔드와 백엔드 모두 빌드 및 배포

#### 4.2 수동 배포
- GitHub 저장소의 Actions 탭에서 "Deploy to EC2" 워크플로우 선택
- "Run workflow" 버튼 클릭
- 배포 타입 선택:
  - `both`: 프론트엔드 + 백엔드
  - `frontend`: 프론트엔드만
  - `backend`: 백엔드만

### 5. 배포 프로세스

#### 5.1 프론트엔드 배포
1. Node.js 18 설치
2. npm 의존성 설치
3. React 앱 빌드
4. 빌드된 파일을 EC2 서버로 전송
5. Nginx 웹 루트에 파일 복사
6. JS 파일 경로 자동 업데이트

#### 5.2 백엔드 배포
1. Java 21 설치
2. Gradle 캐시 사용
3. Spring Boot 앱 빌드
4. JAR 파일을 EC2 서버로 전송
5. car-repair 서비스 재시작

### 6. 모니터링

#### 6.1 배포 상태 확인
```bash
# 서비스 상태 확인
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "sudo systemctl status car-repair"

# 로그 확인
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "sudo journalctl -u car-repair -f"
```

#### 6.2 웹사이트 확인
```bash
# 웹사이트 접속 테스트
curl -I https://hmseok.com
```

### 7. 문제 해결

#### 7.1 SSH 연결 문제
```bash
# SSH 연결 테스트
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "echo 'SSH connection successful'"
```

#### 7.2 권한 문제
```bash
# 배포 스크립트 권한 확인
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "ls -la /home/ubuntu/scripts/deployment/github-deploy.sh"
```

#### 7.3 서비스 문제
```bash
# 서비스 로그 확인
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "sudo journalctl -u car-repair -n 50"
```

### 8. 보안 고려사항

#### 8.1 SSH 키 관리
- GitHub Secrets에 저장된 SSH 키는 암호화되어 저장
- 정기적으로 SSH 키 교체 권장
- EC2 보안 그룹에서 GitHub Actions IP 허용

#### 8.2 접근 제한
- 배포 스크립트는 필요한 디렉토리만 접근
- sudo 권한은 최소한으로 제한

### 9. 성능 최적화

#### 9.1 캐시 활용
- npm 캐시 사용으로 의존성 설치 속도 향상
- Gradle 캐시 사용으로 빌드 속도 향상

#### 9.2 병렬 처리
- 프론트엔드와 백엔드 빌드를 병렬로 실행
- 아티팩트 업로드를 병렬로 처리

### 10. 롤백 전략

#### 10.1 자동 롤백
- 배포 실패 시 이전 버전으로 자동 롤백
- 헬스 체크를 통한 배포 성공 여부 확인

#### 10.2 수동 롤백
```bash
# 이전 버전으로 롤백
ssh -i ~/.ssh/RIDE-EBOT-KR.pem ubuntu@15.164.97.212 "sudo systemctl stop car-repair && sudo cp /home/ubuntu/car-repair-estimate-0.0.1-SNAPSHOT.jar.backup /home/ubuntu/car-repair-estimate-0.0.1-SNAPSHOT.jar && sudo systemctl start car-repair"
```

---

## 🎯 다음 단계

1. GitHub Secrets 설정
2. EC2 서버에 배포 스크립트 업로드
3. 첫 번째 자동 배포 테스트
4. 모니터링 및 알림 설정
5. 성능 최적화 및 보안 강화 