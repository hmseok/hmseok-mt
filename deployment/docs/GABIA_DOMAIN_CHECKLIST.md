# ✅ 가비아 도메인 설정 체크리스트

## 📋 가비아 도메인 기본 설정

- [ ] **가비아 관리자 페이지 접속**
  - [ ] https://admin.gabia.com 접속
  - [ ] 가비아 계정으로 로그인
  - [ ] 도메인 목록에서 `hmseok.com` 확인

- [ ] **도메인 상태 확인**
  - [ ] 도메인 상태: 활성
  - [ ] 등록일 확인
  - [ ] 만료일 확인

## 🌐 DNS 설정 방법 선택

### 방법 1: AWS Route 53 사용 (권장)
- [ ] **AWS Route 53 호스팅 영역 생성**
  - [ ] AWS 콘솔에서 Route 53 접속
  - [ ] 호스팅 영역 생성: `hmseok.com`
  - [ ] 네임서버 정보 확인 (4개)

- [ ] **가비아 네임서버 변경**
  - [ ] 가비아 관리자 페이지 → 도메인 관리
  - [ ] `hmseok.com` 선택 → 네임서버 관리
  - [ ] 네임서버 변경 클릭
  - [ ] AWS Route 53 네임서버 입력:
    ```
    ns-1234.awsdns-12.com
    ns-5678.awsdns-34.net
    ns-9012.awsdns-56.org
    ns-3456.awsdns-78.co.uk
    ```
  - [ ] 변경 완료 후 24-48시간 대기

### 방법 2: 가비아 DNS 사용
- [ ] **가비아 DNS 레코드 설정**
  - [ ] 가비아 관리자 페이지 → DNS 관리
  - [ ] A 레코드 추가:
    ```
    호스트: @ (또는 비워둠)
    값: [AWS Elastic Beanstalk IP 주소]
    TTL: 3600
    ```
  - [ ] CNAME 레코드 추가:
    ```
    호스트: www
    값: hmseok.com
    TTL: 3600
    ```

## 🔒 SSL 인증서 설정

- [ ] **AWS Certificate Manager 인증서 요청**
  - [ ] AWS 콘솔 → Certificate Manager
  - [ ] 인증서 요청: `hmseok.com`
  - [ ] 서브도메인 추가: `*.hmseok.com`
  - [ ] 검증 방법: DNS 검증 선택

- [ ] **DNS 검증 레코드 추가**
  - [ ] ACM에서 제공하는 CNAME 레코드 확인
  - [ ] 가비아 DNS에 검증 레코드 추가
  - [ ] 검증 완료까지 5-10분 대기

## 🚀 AWS 서비스 설정

- [ ] **Elastic Beanstalk 배포**
  - [ ] 애플리케이션 배포 완료
  - [ ] 환경 이름 확인: `car-repair-prod`
  - [ ] 로드 밸런서 설정 (HTTPS 리스너)

- [ ] **Route 53 레코드 설정** (AWS Route 53 사용 시)
  - [ ] A 레코드 생성: `hmseok.com`
  - [ ] A 레코드 생성: `www.hmseok.com`
  - [ ] Alias Target 설정 (Elastic Beanstalk 환경)

## 🔧 애플리케이션 설정

- [ ] **백엔드 설정 업데이트**
  - [ ] CORS 설정에 `hmseok.com` 추가
  - [ ] 보안 헤더 설정
  - [ ] HTTPS 리다이렉션 설정

- [ ] **프론트엔드 설정 업데이트**
  - [ ] API URL을 `https://hmseok.com/api`로 변경
  - [ ] 프로덕션 빌드 확인
  - [ ] 정적 파일 배포

## 🧪 테스트 및 검증

- [ ] **DNS 전파 확인**
  - [ ] `nslookup hmseok.com` 실행
  - [ ] `dig hmseok.com` 실행
  - [ ] 24-48시간 대기 후 재확인

- [ ] **SSL 인증서 확인**
  - [ ] `openssl s_client -connect hmseok.com:443` 실행
  - [ ] 브라우저에서 HTTPS 접속 확인

- [ ] **애플리케이션 테스트**
  - [ ] 웹사이트 접속: `https://hmseok.com`
  - [ ] API 테스트: `https://hmseok.com/api/cars`
  - [ ] 로그인 기능 테스트
  - [ ] 모든 페이지 정상 작동 확인

## 🔒 보안 설정

- [ ] **가비아 보안 설정**
  - [ ] DNSSEC 활성화
  - [ ] 도메인 잠금 활성화
  - [ ] 이전 보호 활성화

- [ ] **AWS 보안 설정**
  - [ ] 보안 그룹 설정
  - [ ] WAF 설정 (선택사항)
  - [ ] CloudTrail 로깅

## 📊 모니터링 설정

- [ ] **CloudWatch 설정**
  - [ ] 메트릭 알람 설정
  - [ ] 로그 수집 설정
  - [ ] 성능 모니터링

- [ ] **가비아 모니터링**
  - [ ] 도메인 상태 모니터링
  - [ ] DNS 레코드 모니터링
  - [ ] SSL 인증서 만료 알림

## 💰 비용 관리

- [ ] **가비아 비용**
  - [ ] 도메인 등록비: 연간 약 15,000원
  - [ ] DNS 서비스: 무료 (기본)
  - [ ] 자동 갱신 설정

- [ ] **AWS 비용**
  - [ ] Route 53: $0.50/월
  - [ ] SSL 인증서: 무료 (ACM)
  - [ ] Elastic Beanstalk: $20-50/월

## 📞 지원 연락처

### 가비아 고객센터
- **전화**: 1544-5114
- **이메일**: support@gabia.com
- **채팅**: 가비아 관리자 페이지

### AWS 지원
- **AWS 콘솔**: 지원 센터
- **문서**: AWS Route 53 가이드
- **커뮤니티**: AWS 포럼

---

## 🎯 최종 확인 사항

### ✅ 완료 후 확인할 URL들:
- **메인 사이트**: `https://hmseok.com`
- **www 서브도메인**: `https://www.hmseok.com`
- **API 엔드포인트**: `https://hmseok.com/api`
- **관리 콘솔**: `https://hmseok.com/admin`
- **API 문서**: `https://hmseok.com/swagger-ui.html`

### 🔍 테스트 명령어:
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

**도메인**: hmseok.com  
**등록업체**: 가비아  
**상태**: 설정 진행 중  
**최종 URL**: https://hmseok.com 