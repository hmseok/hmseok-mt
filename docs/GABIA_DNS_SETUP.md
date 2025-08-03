# 🌐 가비아 DNS 설정 가이드 (EC2 + Nginx)

## 📋 가비아 DNS 설정 단계

### 1. 가비아 관리자 페이지 접속
- **URL**: https://admin.gabia.com
- **로그인**: 가비아 계정으로 로그인

### 2. 도메인 관리
- **도메인**: `hmseok.com`
- **상태**: 활성화 확인

### 3. DNS 레코드 설정

#### 3.1 A 레코드 설정 (루트 도메인)
1. **도메인 관리** → **DNS 관리** 클릭
2. **레코드 추가** 클릭
3. 다음 정보 입력:
   ```
   레코드 타입: A
   호스트: @ (또는 비워둠)
   값: 54.180.88.243 (EC2 IP 주소)
   TTL: 3600
   ```

#### 3.2 CNAME 레코드 설정 (www 서브도메인)
1. **레코드 추가** 클릭
2. 다음 정보 입력:
   ```
   레코드 타입: CNAME
   호스트: www
   값: hmseok.com
   TTL: 3600
   ```

#### 3.3 MX 레코드 설정 (이메일용, 선택사항)
1. **레코드 추가** 클릭
2. 다음 정보 입력:
   ```
   레코드 타입: MX
   호스트: @
   값: 10 mail.hmseok.com
   TTL: 3600
   ```

### 4. DNS 설정 확인

#### 4.1 설정된 레코드 목록
```
Type: A
Name: @
Value: 54.180.88.243
TTL: 3600

Type: CNAME
Name: www
Value: hmseok.com
TTL: 3600
```

#### 4.2 DNS 전파 확인
```bash
# DNS 확인
nslookup hmseok.com
dig hmseok.com

# 특정 네임서버로 확인
dig @8.8.8.8 hmseok.com
```

### 5. Let's Encrypt SSL 인증서 설정

#### 5.1 도메인 연결 확인
- DNS 설정 후 24-48시간 대기
- 도메인이 EC2 서버로 연결되는지 확인

#### 5.2 SSL 인증서 자동 발급
- EC2 서버에서 Let's Encrypt가 자동으로 SSL 인증서 발급
- 도메인 연결이 완료되면 자동으로 HTTPS 적용

### 6. 가비아 관리자 페이지 설정

#### 6.1 도메인 정보
- **도메인**: hmseok.com
- **등록일**: [구매일]
- **만료일**: [갱신일]
- **상태**: 활성

#### 6.2 DNS 관리
- **DNS 서비스**: 가비아 DNS 사용
- **레코드**: A, CNAME, MX 등 설정

#### 6.3 보안 설정
- **DNSSEC**: 활성화 (권장)
- **도메인 잠금**: 활성화
- **이전 보호**: 활성화

### 7. 문제 해결

#### 7.1 일반적인 문제들
1. **DNS 전파 지연**: 24-48시간 소요
2. **A 레코드 설정 오류**: IP 주소 확인
3. **CNAME 설정 오류**: 도메인 이름 확인
4. **SSL 인증서 발급 실패**: 도메인 연결 확인

#### 7.2 디버깅 명령어
```bash
# DNS 확인
nslookup hmseok.com
dig hmseok.com

# 특정 네임서버로 확인
dig @8.8.8.8 hmseok.com
dig @1.1.1.1 hmseok.com

# SSL 인증서 확인
openssl s_client -connect hmseok.com:443
```

### 8. 가비아 고객센터 연락처
- **전화**: 1544-5114
- **이메일**: support@gabia.com
- **채팅**: 가비아 관리자 페이지

### 9. 최종 확인 사항

#### 9.1 도메인 연결 테스트
```bash
# 웹사이트 접속 테스트
curl -I http://hmseok.com
curl -I https://hmseok.com

# API 테스트
curl -I https://hmseok.com/api/cars
```

#### 9.2 브라우저 테스트
- **메인 사이트**: https://hmseok.com
- **www 서브도메인**: https://www.hmseok.com
- **API 문서**: https://hmseok.com/swagger-ui.html

### 10. 설정 완료 후 확인

#### 10.1 웹사이트 접속
- 브라우저에서 `https://hmseok.com` 접속
- 자동으로 HTTPS로 리다이렉트되는지 확인

#### 10.2 API 테스트
- `https://hmseok.com/api/cars` 접속
- JSON 응답이 정상적으로 나오는지 확인

#### 10.3 SSL 인증서 확인
- 브라우저 주소창의 자물쇠 아이콘 확인
- 인증서 정보에서 Let's Encrypt 확인

---

**도메인**: hmseok.com  
**등록업체**: 가비아  
**서버**: EC2 (54.180.88.243)  
**웹서버**: Nginx  
**SSL**: Let's Encrypt  
**최종 URL**: https://hmseok.com 