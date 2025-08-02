# 🌐 도메인 설정 및 AWS 연동 가이드

## 📋 도메인 구매 및 설정 단계

### 1. 도메인 구매
- **도메인**: `hmseok-mt.com`
- **구매처**: AWS Route 53 또는 다른 도메인 등록업체
- **가격**: 연간 약 $12-15

### 2. AWS Route 53 설정

#### 2.1 호스팅 영역 생성
```bash
# AWS CLI를 사용한 호스팅 영역 생성
aws route53 create-hosted-zone \
  --name hmseok-mt.com \
  --caller-reference $(date +%s)
```

#### 2.2 네임서버 설정
- Route 53에서 제공하는 네임서버를 도메인 등록업체에 설정
- 보통 4개의 네임서버 주소 제공

### 3. SSL 인증서 설정

#### 3.1 AWS Certificate Manager에서 인증서 요청
```bash
# 인증서 요청
aws acm request-certificate \
  --domain-name hmseok-mt.com \
  --subject-alternative-names "*.hmseok-mt.com" \
  --validation-method DNS \
  --region ap-northeast-2
```

#### 3.2 DNS 검증
- ACM에서 제공하는 CNAME 레코드를 Route 53에 추가
- 검증 완료까지 5-10분 소요

### 4. Elastic Beanstalk 환경 설정

#### 4.1 환경 변수 설정
```
DOMAIN_NAME=hmseok-mt.com
SSL_CERTIFICATE_ARN=arn:aws:acm:ap-northeast-2:123456789012:certificate/xxxxx
```

#### 4.2 로드 밸런서 설정
- **리스너**: 443 포트 (HTTPS)
- **SSL 인증서**: ACM에서 생성한 인증서 연결
- **리다이렉션**: HTTP → HTTPS

### 5. Route 53 레코드 설정

#### 5.1 A 레코드 생성
```json
{
  "Name": "hmseok-mt.com",
  "Type": "A",
  "AliasTarget": {
    "HostedZoneId": "Z2OJLYMUO9EFXC",
    "DNSName": "your-eb-environment.elasticbeanstalk.com",
    "EvaluateTargetHealth": true
  }
}
```

#### 5.2 www 서브도메인 설정
```json
{
  "Name": "www.hmseok-mt.com",
  "Type": "A",
  "AliasTarget": {
    "HostedZoneId": "Z2OJLYMUO9EFXC",
    "DNSName": "your-eb-environment.elasticbeanstalk.com",
    "EvaluateTargetHealth": true
  }
}
```

### 6. CloudFront 설정 (선택사항)

#### 6.1 배포 생성
- **Origin**: Elastic Beanstalk 환경
- **Behaviors**: 
  - `/api/*` → Elastic Beanstalk
  - `/*` → S3 (정적 파일)

#### 6.2 캐싱 설정
- **TTL**: 24시간 (정적 파일)
- **API**: 캐싱 비활성화

### 7. 애플리케이션 설정 업데이트

#### 7.1 CORS 설정
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "https://hmseok-mt.com",
            "https://www.hmseok-mt.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### 7.2 프론트엔드 API 설정
```typescript
// frontend/src/config/api.ts
const isProduction = window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction 
  ? 'https://hmseok-mt.com/api' 
  : 'http://localhost:8080/api';
```

### 8. 배포 스크립트

#### 8.1 도메인 배포 스크립트
```bash
#!/bin/bash
# deploy-domain.sh

DOMAIN_NAME="hmseok-mt.com"
AWS_REGION="ap-northeast-2"

# SSL 인증서 확인
CERT_ARN=$(aws acm list-certificates --region $AWS_REGION \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" \
  --output text)

# Elastic Beanstalk 환경 업데이트
aws elasticbeanstalk update-environment \
  --environment-name car-repair-prod \
  --option-settings \
    Namespace=aws:elbv2:listener:443,OptionName=SSLCertificateArns,Value=$CERT_ARN

echo "✅ 도메인 설정 완료!"
echo "🌐 웹사이트: https://$DOMAIN_NAME"
```

### 9. 모니터링 및 로그

#### 9.1 CloudWatch 설정
- **메트릭**: CPU, 메모리, 네트워크
- **알람**: 에러율, 응답 시간
- **로그**: 애플리케이션 로그, 액세스 로그

#### 9.2 헬스 체크
```bash
# 도메인 연결 테스트
curl -I https://hmseok-mt.com
curl -I https://hmseok-mt.com/api/cars
```

### 10. 보안 설정

#### 10.1 보안 헤더
```java
@Configuration
public class SecurityHeadersConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.headers()
            .frameOptions().deny()
            .contentTypeOptions()
            .and()
            .httpStrictTransportSecurity()
            .and()
            .xssProtection();
        return http.build();
    }
}
```

#### 10.2 WAF 설정 (선택사항)
- **AWS WAF**: DDoS 방어, SQL 인젝션 방지
- **규칙**: IP 화이트리스트, 요청 제한

### 11. 비용 최적화

#### 11.1 예상 월 비용
- **Route 53**: $0.50/월
- **SSL 인증서**: 무료 (ACM)
- **Elastic Beanstalk**: $20-50/월
- **CloudFront**: $0.085/GB
- **총 예상 비용**: $30-80/월

#### 11.2 비용 절약 팁
- **예약 인스턴스**: 1-3년 약정 시 할인
- **Auto Scaling**: 트래픽에 따른 자동 조절
- **CloudFront**: 정적 파일 캐싱으로 서버 부하 감소

### 12. 문제 해결

#### 12.1 일반적인 문제들
1. **DNS 전파 지연**: 24-48시간 소요
2. **SSL 인증서 검증 실패**: DNS 레코드 확인
3. **CORS 오류**: 도메인 설정 확인
4. **HTTPS 리다이렉션 실패**: 로드 밸런서 설정 확인

#### 12.2 디버깅 명령어
```bash
# DNS 확인
nslookup hmseok-mt.com
dig hmseok-mt.com

# SSL 인증서 확인
openssl s_client -connect hmseok-mt.com:443

# 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s https://hmseok-mt.com
```

---

**최종 URL**: `https://hmseok-mt.com`
**관리 콘솔**: `https://hmseok-mt.com/admin`
**API 문서**: `https://hmseok-mt.com/swagger-ui.html` 