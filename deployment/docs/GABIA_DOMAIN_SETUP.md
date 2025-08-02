# 🌐 가비아 도메인 설정 가이드

## 📋 가비아 도메인 설정 단계

### 1. 가비아 관리자 페이지 접속
- **URL**: https://admin.gabia.com
- **로그인**: 가비아 계정으로 로그인

### 2. 도메인 관리
- **도메인**: `hmseok.com`
- **상태**: 활성화 확인

### 3. DNS 설정

#### 3.1 네임서버 변경 (AWS Route 53 사용 시)
1. **도메인 관리** → **네임서버 관리**
2. **네임서버 변경** 클릭
3. AWS Route 53에서 제공하는 네임서버 입력:
   ```
   ns-1234.awsdns-12.com
   ns-5678.awsdns-34.net
   ns-9012.awsdns-56.org
   ns-3456.awsdns-78.co.uk
   ```

#### 3.2 DNS 레코드 설정 (가비아 DNS 사용 시)
1. **도메인 관리** → **DNS 관리**
2. **A 레코드** 추가:
   ```
   호스트: @ (또는 비워둠)
   값: [AWS Elastic Beanstalk IP 주소]
   TTL: 3600
   ```
3. **CNAME 레코드** 추가:
   ```
   호스트: www
   값: hmseok.com
   TTL: 3600
   ```

### 4. AWS Route 53 설정

#### 4.1 호스팅 영역 생성
```bash
# AWS CLI를 사용한 호스팅 영역 생성
aws route53 create-hosted-zone \
  --name hmseok.com \
  --caller-reference $(date +%s)
```

#### 4.2 네임서버 정보 확인
- AWS Route 53 콘솔에서 네임서버 정보 확인
- 가비아 관리자 페이지에 네임서버 설정

### 5. SSL 인증서 설정

#### 5.1 AWS Certificate Manager에서 인증서 요청
```bash
# 인증서 요청
aws acm request-certificate \
  --domain-name hmseok.com \
  --subject-alternative-names "*.hmseok.com" \
  --validation-method DNS \
  --region ap-northeast-2
```

#### 5.2 DNS 검증
- ACM에서 제공하는 CNAME 레코드를 가비아 DNS에 추가
- 검증 완료까지 5-10분 소요

### 6. 가비아 DNS 레코드 예시

#### 6.1 AWS Route 53 사용 시
```
Type: NS
Name: @
Value: ns-1234.awsdns-12.com
TTL: 172800

Type: NS
Name: @
Value: ns-5678.awsdns-34.net
TTL: 172800

Type: NS
Name: @
Value: ns-9012.awsdns-56.org
TTL: 172800

Type: NS
Name: @
Value: ns-3456.awsdns-78.co.uk
TTL: 172800
```

#### 6.2 가비아 DNS 사용 시
```
Type: A
Name: @
Value: [AWS Elastic Beanstalk IP]
TTL: 3600

Type: CNAME
Name: www
Value: hmseok.com
TTL: 3600

Type: CNAME
Name: _acm-validation
Value: [ACM에서 제공하는 값]
TTL: 3600
```

### 7. 도메인 연결 확인

#### 7.1 DNS 전파 확인
```bash
# DNS 확인
nslookup hmseok.com
dig hmseok.com

# 특정 네임서버로 확인
dig @8.8.8.8 hmseok.com
```

#### 7.2 SSL 인증서 확인
```bash
# SSL 인증서 확인
openssl s_client -connect hmseok.com:443
```

### 8. 가비아 관리자 페이지 설정

#### 8.1 도메인 정보
- **도메인**: hmseok.com
- **등록일**: [구매일]
- **만료일**: [갱신일]
- **상태**: 활성

#### 8.2 DNS 관리
- **네임서버**: AWS Route 53 또는 가비아 DNS
- **DNS 레코드**: A, CNAME, MX 등 설정

#### 8.3 보안 설정
- **DNSSEC**: 활성화 (권장)
- **도메인 잠금**: 활성화
- **이전 보호**: 활성화

### 9. 문제 해결

#### 9.1 일반적인 문제들
1. **DNS 전파 지연**: 24-48시간 소요
2. **네임서버 설정 오류**: 가비아 관리자 페이지에서 확인
3. **SSL 인증서 검증 실패**: DNS 레코드 확인

#### 9.2 가비아 고객센터 연락처
- **전화**: 1544-5114
- **이메일**: support@gabia.com
- **채팅**: 가비아 관리자 페이지

### 10. 비용 정보

#### 10.1 가비아 도메인 비용
- **도메인 등록**: 연간 약 15,000원
- **DNS 서비스**: 무료 (기본)
- **SSL 인증서**: 무료 (Let's Encrypt)

#### 10.2 AWS 서비스 비용
- **Route 53**: $0.50/월
- **SSL 인증서**: 무료 (ACM)
- **Elastic Beanstalk**: $20-50/월

### 11. 최종 확인 사항

#### 11.1 도메인 연결 테스트
```bash
# 웹사이트 접속 테스트
curl -I https://hmseok.com
curl -I https://www.hmseok.com

# API 테스트
curl -I https://hmseok.com/api/cars
```

#### 11.2 브라우저 테스트
- **메인 사이트**: https://hmseok.com
- **www 서브도메인**: https://www.hmseok.com
- **API 문서**: https://hmseok.com/swagger-ui.html

---

**도메인**: hmseok.com  
**등록업체**: 가비아  
**상태**: 활성  
**최종 URL**: https://hmseok.com 