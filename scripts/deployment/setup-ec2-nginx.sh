#!/bin/bash

echo "🚀 EC2 + Nginx + Let's Encrypt 설정 시작..."

# 환경 변수 설정
DOMAIN="hmseok.com"
EC2_HOST="43.201.22.156"
EC2_USER="ubuntu"
EC2_KEY="../hmseok-mt.pem"

# 1. EC2 인스턴스에 접속하여 기본 설정
echo "🔧 EC2 인스턴스 기본 설정 중..."
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
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
    
    echo "✅ 기본 설정 완료"
EOF

# 2. Nginx 설정 파일 생성
echo "📝 Nginx 설정 파일 생성 중..."
cat > nginx.conf << 'EOF'
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
EOF

# 3. Nginx 설정 파일 업로드
echo "📤 Nginx 설정 파일 업로드 중..."
scp -i "$EC2_KEY" nginx.conf $EC2_USER@$EC2_HOST:/tmp/

# 4. EC2에서 Nginx 설정 적용
echo "🔧 Nginx 설정 적용 중..."
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # 기존 설정 백업
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # 새 설정 적용
    sudo cp /tmp/nginx.conf /etc/nginx/conf.d/hmseok.com.conf
    
    # Nginx 설정 테스트
    sudo nginx -t
    
    # Nginx 재시작
    sudo systemctl restart nginx
    
    echo "✅ Nginx 설정 완료"
EOF

# 5. Let's Encrypt SSL 인증서 발급
echo "🔒 Let's Encrypt SSL 인증서 발급 중..."
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # SSL 인증서 발급
    sudo certbot --nginx -d hmseok.com -d www.hmseok.com --non-interactive --agree-tos --email admin@hmseok.com
    
    # 자동 갱신 설정
    sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -
    
    echo "✅ SSL 인증서 발급 완료"
EOF

# 6. 백엔드 애플리케이션 배포
echo "📦 백엔드 애플리케이션 배포 중..."
scp -i "$EC2_KEY" backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar $EC2_USER@$EC2_HOST:/home/$EC2_USER/

ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # 기존 프로세스 종료
    pkill -f car-repair-estimate || true
    
    # 애플리케이션 시작
    nohup java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    
    echo "✅ 백엔드 애플리케이션 배포 완료"
EOF

# 7. 프론트엔드 빌드 및 배포
echo "🎨 프론트엔드 빌드 및 배포 중..."
cd frontend && npm run build && cd ..

# 빌드된 파일을 EC2로 업로드
ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST "sudo mkdir -p /var/www/html"
scp -i "$EC2_KEY" -r frontend/dist/* $EC2_USER@$EC2_HOST:/tmp/frontend/

ssh -i "$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # 프론트엔드 파일 배포
    sudo cp -r /tmp/frontend/* /var/www/html/
    sudo chown -R nginx:nginx /var/www/html
    sudo chmod -R 755 /var/www/html
    
    echo "✅ 프론트엔드 배포 완료"
EOF

echo "🎉 EC2 + Nginx + Let's Encrypt 설정 완료!"
echo "🌐 웹사이트: https://hmseok.com"
echo "🔧 API: https://hmseok.com/api"
echo "📊 관리 콘솔: https://hmseok.com/admin"

# 정리
rm -f nginx.conf 