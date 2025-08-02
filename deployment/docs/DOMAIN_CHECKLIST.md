# ✅ 도메인 설정 체크리스트

## 📋 도메인 구매 및 기본 설정

- [ ] **도메인 구매**
  - [ ] `hmseok-mt.com` 도메인 구매
  - [ ] 도메인 등록업체에서 네임서버 설정 준비

- [ ] **AWS Route 53 설정**
  - [ ] 호스팅 영역 생성
  - [ ] 네임서버 정보 확인
  - [ ] 도메인 등록업체에 네임서버 설정

## 🔒 SSL 인증서 설정

- [ ] **AWS Certificate Manager**
  - [ ] SSL 인증서 요청 (`hmseok-mt.com`, `*.hmseok-mt.com`)
  - [ ] DNS 검증 레코드 추가
  - [ ] 인증서 검증 완료 확인

## 🚀 AWS 서비스 설정

- [ ] **Elastic Beanstalk**
  - [ ] 애플리케이션 배포 완료
  - [ ] 환경 이름 확인 (`car-repair-prod`)
  - [ ] 로드 밸런서 설정 (HTTPS 리스너)

- [ ] **Route 53 레코드**
  - [ ] A 레코드 생성 (`hmseok-mt.com`)
  - [ ] A 레코드 생성 (`www.hmseok-mt.com`)
  - [ ] Alias Target 설정 (Elastic Beanstalk 환경)

## 🔧 애플리케이션 설정

- [ ] **백엔드 설정**
  - [ ] CORS 설정 업데이트 (도메인 허용)
  - [ ] 보안 헤더 설정
  - [ ] HTTPS 리다이렉션 설정

- [ ] **프론트엔드 설정**
  - [ ] API URL 설정 업데이트
  - [ ] 프로덕션 빌드 확인
  - [ ] 정적 파일 배포

## ☁️ 추가 서비스 (선택사항)

- [ ] **CloudFront 설정**
  - [ ] 배포 생성
  - [ ] Origin 설정 (Elastic Beanstalk)
  - [ ] 캐싱 규칙 설정
  - [ ] 도메인 연결

- [ ] **모니터링 설정**
  - [ ] CloudWatch 알람 설정
  - [ ] 로그 수집 설정
  - [ ] 성능 메트릭 모니터링

## 🧪 테스트 및 검증

- [ ] **DNS 전파 확인**
  - [ ] `nslookup hmseok-mt.com`
  - [ ] `dig hmseok-mt.com`
  - [ ] 24-48시간 대기

- [ ] **SSL 인증서 확인**
  - [ ] `openssl s_client -connect hmseok-mt.com:443`
  - [ ] 브라우저에서 HTTPS 접속 확인

- [ ] **애플리케이션 테스트**
  - [ ] 웹사이트 접속: `https://hmseok-mt.com`
  - [ ] API 테스트: `https://hmseok-mt.com/api/cars`
  - [ ] 로그인 기능 테스트
  - [ ] 모든 페이지 정상 작동 확인

## 🔒 보안 설정

- [ ] **보안 헤더**
  - [ ] HSTS 설정
  - [ ] XSS Protection
  - [ ] Content Security Policy

- [ ] **접근 제어**
  - [ ] 관리자 페이지 보안
  - [ ] API 인증 설정
  - [ ] 로그인 세션 관리

## 📊 모니터링 및 유지보수

- [ ] **성능 모니터링**
  - [ ] 응답 시간 측정
  - [ ] 에러율 모니터링
  - [ ] 트래픽 분석

- [ ] **백업 및 복구**
  - [ ] 데이터베이스 백업 설정
  - [ ] 애플리케이션 백업
  - [ ] 재해 복구 계획

## 💰 비용 최적화

- [ ] **비용 모니터링**
  - [ ] CloudWatch 비용 알람 설정
  - [ ] 월별 비용 추적
  - [ ] 사용량 최적화

- [ ] **성능 최적화**
  - [ ] 이미지 압축
  - [ ] 코드 분할 (Code Splitting)
  - [ ] 캐싱 전략

## 📝 문서화

- [ ] **운영 문서**
  - [ ] 배포 가이드 작성
  - [ ] 문제 해결 가이드
  - [ ] 모니터링 대시보드

- [ ] **사용자 가이드**
  - [ ] 사용자 매뉴얼
  - [ ] 관리자 가이드
  - [ ] API 문서

---

## 🎯 최종 확인 사항

### ✅ 완료 후 확인할 URL들:
- **메인 사이트**: `https://hmseok-mt.com`
- **www 서브도메인**: `https://www.hmseok-mt.com`
- **API 엔드포인트**: `https://hmseok-mt.com/api`
- **관리 콘솔**: `https://hmseok-mt.com/admin`
- **API 문서**: `https://hmseok-mt.com/swagger-ui.html`

### 🔍 테스트 명령어:
```bash
# DNS 확인
nslookup hmseok-mt.com
dig hmseok-mt.com

# SSL 인증서 확인
openssl s_client -connect hmseok-mt.com:443

# 웹사이트 접속 테스트
curl -I https://hmseok-mt.com
curl -I https://hmseok-mt.com/api/cars

# 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s https://hmseok-mt.com
```

### 📞 문제 발생 시 연락처:
- **AWS 지원**: AWS 콘솔 → 지원 센터
- **도메인 등록업체**: 도메인 구매한 업체 고객센터
- **개발팀**: 프로젝트 담당자

---

**마지막 업데이트**: 2025-07-31
**담당자**: 개발팀
**상태**: 진행 중 