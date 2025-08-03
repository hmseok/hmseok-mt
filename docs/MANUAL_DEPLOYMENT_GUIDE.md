# 🔧 수동 배포 가이드 (EC2 + Nginx + Let's Encrypt)

## 📋 사전 준비

### 1. EC2 인스턴스 정보
- **IP 주소**: 54.180.88.243
- **사용자**: ec2-user
- **키 파일**: hmseok-mt.pem (AWS 콘솔에서 다운로드 필요)

### 2. AWS 콘솔에서 키 파일 다운로드
1. AWS EC2 콘솔 접속
2. **키 페어** → **hmseok-mt** 선택
3. **작업** → **키 페어 다운로드**
4. 다운로드된 파일을 프로젝트 루트에 `hmseok-mt.pem`으로 저장

## 🚀 수동 배포 단계

### 1단계: 백엔드 빌드
```bash
cd backend
./gradlew clean build -x test
cd ..
```

### 2단계: 프론트엔드 빌드
```bash
cd frontend
npm run build
cd ..
```

### 3단계: EC2 서버 설정

#### 3.1 EC2에 SSH 접속
```bash
ssh -i hmseok-mt.pem ec2-user@54.180.88.243
```

#### 3.2 시스템 패키지 설치
```bash
# 시스템 업데이트
sudo yum update -y

# Java 21 설치
sudo yum install java-21-amazon-corretto -y

# Nginx 설치
sudo yum install nginx -y

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# 방화벽 설정
sudo yum install firewalld -y
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Certbot 설치 (Let's Encrypt)
sudo yum install epel-release -y
sudo yum install certbot python3-certbot-nginx -y
```

### 4단계: Nginx 설정

#### 4.1 Nginx 설정 파일 생성
```bash
sudo nano /etc/nginx/conf.d/hmseok.com.conf
```

#### 4.2 다음 내용 입력:
```nginx
server {
    listen 80;
    server_name hmseok.com www.hmseok.com;
    
    # HTTP를 HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hmseok.com www.hmseok.com;
    
    # SSL 설정 (Let's Encrypt로 자동 설정됨)
    ssl_certificate /etc/letsencrypt/live/hmseok.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hmseok.com/privkey.pem;
    
    # SSL 보안 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 보안 헤더
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 프론트엔드 정적 파일 서빙
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        
        # 캐싱 설정
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 백엔드 API 프록시
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 헤더
        add_header Access-Control-Allow-Origin "https://hmseok.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # OPTIONS 요청 처리
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://hmseok.com" always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
            add_header Access-Control-Allow-Credentials "true" always;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }
    
    # H2 콘솔 (개발용)
    location /h2-console/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Swagger UI
    location /swagger-ui/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 로그 설정
    access_log /var/log/nginx/hmseok.com.access.log;
    error_log /var/log/nginx/hmseok.com.error.log;
}
```

#### 4.3 Nginx 설정 테스트 및 재시작
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 5단계: Let's Encrypt SSL 인증서 발급

```bash
# SSL 인증서 발급
sudo certbot --nginx -d hmseok.com -d www.hmseok.com --non-interactive --agree-tos --email admin@hmseok.com

# 자동 갱신 설정
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -
```

### 6단계: 애플리케이션 배포

#### 6.1 로컬에서 파일 업로드
```bash
# 백엔드 JAR 파일 업로드
scp -i hmseok-mt.pem backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ec2-user@54.180.88.243:/home/ec2-user/

# 프론트엔드 파일 업로드
scp -i hmseok-mt.pem -r frontend/dist/* ec2-user@54.180.88.243:/tmp/frontend/
```

#### 6.2 EC2에서 애플리케이션 시작
```bash
# 기존 프로세스 종료
pkill -f car-repair-estimate || true

# 프론트엔드 파일 배포
sudo cp -r /tmp/frontend/* /var/www/html/
sudo chown -R nginx:nginx /var/www/html
sudo chmod -R 755 /var/www/html

# 백엔드 애플리케이션 시작
nohup java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

## ✅ 최종 확인

### 1. 웹사이트 접속 테스트
- https://hmseok.com
- https://www.hmseok.com

### 2. API 테스트
- https://hmseok.com/api/cars

### 3. SSL 인증서 확인
```bash
openssl s_client -connect hmseok.com:443
```

## 🆘 문제 해결

### SSH 연결 문제
```bash
# 키 파일 권한 확인
chmod 400 hmseok-mt.pem

# SSH 연결 테스트
ssh -i hmseok-mt.pem -o StrictHostKeyChecking=no ec2-user@54.180.88.243
```

### Nginx 설정 문제
```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 상태 확인
sudo systemctl status nginx
```

### SSL 인증서 문제
```bash
# 인증서 상태 확인
sudo certbot certificates

# 수동 갱신 테스트
sudo certbot renew --dry-run
```

---

**도메인**: hmseok.com  
**서버**: EC2 (54.180.88.243)  
**웹서버**: Nginx  
**SSL**: Let's Encrypt  
**최종 URL**: https://hmseok.com 