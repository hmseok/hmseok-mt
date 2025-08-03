# ✅ EC2 + Nginx + Let's Encrypt 배포 체크리스트

## 📋 사전 준비 사항

- [ ] **가비아 도메인 설정**
  - [ ] 가비아 관리자 페이지에서 A 레코드 설정
  - [ ] 도메인: `hmseok.com` → IP: `54.180.88.243`
  - [ ] CNAME 레코드: `www.hmseok.com` → `hmseok.com`

- [ ] **EC2 인스턴스 확인**
  - [ ] EC2 인스턴스 실행 중
  - [ ] 보안 그룹 설정 (80, 443, 22 포트 허용)
  - [ ] 키 파일 준비 (`hmseok-mt.pem`)

- [ ] **로컬 빌드 준비**
  - [ ] 백엔드 JAR 파일 빌드 완료
  - [ ] 프론트엔드 빌드 완료
  - [ ] 스크립트 실행 권한 설정

## 🚀 배포 실행

- [ ] **배포 스크립트 실행**
  - [ ] `./setup-ec2-nginx.sh` 실행
  - [ ] 모든 단계 성공적으로 완료 확인

## 🔧 EC2 서버 설정 확인

- [ ] **시스템 패키지 설치**
  - [ ] Java 21 설치 완료
  - [ ] Nginx 설치 완료
  - [ ] Certbot 설치 완료
  - [ ] 방화벽 설정 완료

- [ ] **Nginx 설정**
  - [ ] 설정 파일 업로드 완료
  - [ ] Nginx 설정 테스트 통과
  - [ ] Nginx 서비스 재시작 완료

- [ ] **SSL 인증서**
  - [ ] Let's Encrypt 인증서 발급 완료
  - [ ] 자동 갱신 설정 완료
  - [ ] HTTPS 리다이렉트 설정 완료

## 📦 애플리케이션 배포

- [ ] **백엔드 배포**
  - [ ] JAR 파일 업로드 완료
  - [ ] 애플리케이션 시작 완료
  - [ ] 로그 확인 (오류 없음)

- [ ] **프론트엔드 배포**
  - [ ] 빌드 파일 업로드 완료
  - [ ] Nginx 정적 파일 서빙 설정 완료
  - [ ] 파일 권한 설정 완료

## 🌐 도메인 연결 확인

- [ ] **DNS 전파 확인**
  - [ ] `nslookup hmseok.com` 실행
  - [ ] `dig hmseok.com` 실행
  - [ ] 24-48시간 대기 후 재확인

- [ ] **SSL 인증서 확인**
  - [ ] `openssl s_client -connect hmseok.com:443` 실행
  - [ ] 브라우저에서 HTTPS 접속 확인
  - [ ] 자물쇠 아이콘 확인

## 🧪 기능 테스트

- [ ] **웹사이트 접속 테스트**
  - [ ] https://hmseok.com 접속
  - [ ] https://www.hmseok.com 접속
  - [ ] 자동 HTTPS 리다이렉트 확인

- [ ] **API 테스트**
  - [ ] https://hmseok.com/api/cars 접속
  - [ ] JSON 응답 확인
  - [ ] CORS 설정 확인

- [ ] **관리 기능 테스트**
  - [ ] 로그인 기능 테스트
  - [ ] 데이터 CRUD 기능 테스트
  - [ ] 모든 페이지 정상 작동 확인

## 🔒 보안 설정 확인

- [ ] **HTTPS 설정**
  - [ ] HTTP → HTTPS 자동 리다이렉트
  - [ ] SSL 인증서 유효성
  - [ ] 보안 헤더 설정

- [ ] **방화벽 설정**
  - [ ] 80, 443, 22 포트만 허용
  - [ ] 불필요한 포트 차단
  - [ ] SSH 접속 보안

## 📊 모니터링 설정

- [ ] **로그 모니터링**
  - [ ] Nginx 액세스 로그 확인
  - [ ] 애플리케이션 로그 확인
  - [ ] 에러 로그 모니터링

- [ ] **성능 모니터링**
  - [ ] 응답 시간 측정
  - [ ] 서버 리소스 사용량 확인
  - [ ] 트래픽 분석

## 🔄 자동화 설정

- [ ] **SSL 인증서 자동 갱신**
  - [ ] Crontab 설정 확인
  - [ ] 갱신 테스트 실행

- [ ] **애플리케이션 자동 재시작**
  - [ ] Systemd 서비스 설정
  - [ ] 자동 재시작 테스트

## 📝 문서화

- [ ] **운영 문서**
  - [ ] 배포 가이드 작성
  - [ ] 문제 해결 가이드
  - [ ] 모니터링 대시보드

- [ ] **사용자 가이드**
  - [ ] 사용자 매뉴얼
  - [ ] 관리자 가이드
  - [ ] API 문서

## 🆘 문제 해결

### 일반적인 문제들
1. **DNS 전파 지연**: 24-48시간 대기
2. **SSL 인증서 발급 실패**: 도메인 연결 확인
3. **Nginx 설정 오류**: 설정 파일 문법 확인
4. **애플리케이션 시작 실패**: 로그 확인

### 디버깅 명령어
```bash
# EC2 서버 상태 확인
ssh -i hmseok-mt.pem ec2-user@54.180.88.243

# Nginx 상태 확인
sudo systemctl status nginx
sudo nginx -t

# 애플리케이션 상태 확인
ps aux | grep java
tail -f app.log

# SSL 인증서 확인
sudo certbot certificates

# 방화벽 상태 확인
sudo firewall-cmd --list-all
```

---

## 🎯 최종 확인 사항

### ✅ 완료 후 확인할 URL들:
- **메인 사이트**: `https://hmseok.com`
- **www 서브도메인**: `https://www.hmseok.com`
- **API 엔드포인트**: `https://hmseok.com/api`
- **관리 콘솔**: `https://hmseok.com/admin`
- **API 문서**: `https://hmseok.com/swagger-ui.html`

### 🔍 최종 테스트 명령어:
```bash
# DNS 확인
nslookup hmseok.com
dig hmseok.com

# SSL 인증서 확인
openssl s_client -connect hmseok.com:443

# 웹사이트 접속 테스트
curl -I https://hmseok.com
curl -I https://hmseok.com/api/cars

# 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s https://hmseok.com
```

---

**서버**: EC2 (54.180.88.243)  
**웹서버**: Nginx  
**SSL**: Let's Encrypt  
**도메인**: hmseok.com  
**최종 URL**: https://hmseok.com 