#!/bin/bash

echo "🚀 새 EC2 서버 설정 시작..."

# 1. 시스템 업데이트
echo "📦 시스템 업데이트 중..."
sudo yum update -y

# 2. Java 21 설치
echo "☕ Java 21 설치 중..."
sudo yum install java-21-amazon-corretto -y

# 3. Nginx 설치
echo "🌐 Nginx 설치 중..."
sudo yum install nginx -y

# 4. Nginx 시작 및 자동 시작 설정
echo "🔧 Nginx 설정 중..."
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. 방화벽 설정
echo "🔥 방화벽 설정 중..."
sudo yum install firewalld -y
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# 6. Certbot 설치 (Let's Encrypt)
echo "🔒 Certbot 설치 중..."
sudo yum install epel-release -y
sudo yum install certbot python3-certbot-nginx -y

# 7. 프론트엔드 디렉토리 생성
echo "📁 프론트엔드 디렉토리 생성 중..."
sudo mkdir -p /var/www/html

# 8. 백엔드 디렉토리 생성
echo "📁 백엔드 디렉토리 생성 중..."
mkdir -p /home/ec2-user/app

# 9. Nginx 설정 파일 생성
echo "📝 Nginx 설정 파일 생성 중..."
sudo tee /etc/nginx/conf.d/hmseok.com.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name hmseok.com www.hmseok.com;
    
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

# 10. Nginx 설정 테스트 및 재시작
echo "✅ Nginx 설정 테스트 중..."
sudo nginx -t
sudo systemctl restart nginx

# 11. 백엔드 시작 스크립트 생성
echo "📝 백엔드 시작 스크립트 생성 중..."
tee /home/ec2-user/start-backend.sh > /dev/null << 'EOF'
#!/bin/bash

echo "🚀 백엔드 애플리케이션 시작 스크립트"

# Java 21 경로 설정
export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto
echo "Java 경로: $JAVA_HOME"

# 기존 프로세스 종료
echo "🔧 기존 프로세스 종료 중..."
pkill -f car-repair-estimate || true
sleep 2

# 백엔드 JAR 파일 확인
echo "📦 JAR 파일 확인 중..."
if [ ! -f "car-repair-estimate-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ JAR 파일이 없습니다!"
    exit 1
fi

# 백엔드 애플리케이션 시작
echo "🚀 백엔드 애플리케이션 시작 중..."
nohup $JAVA_HOME/bin/java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 프로세스 ID 확인
sleep 5
PID=$(pgrep -f car-repair-estimate)
if [ -n "$PID" ]; then
    echo "✅ 백엔드 애플리케이션이 시작되었습니다. PID: $PID"
    echo "📋 로그 확인: tail -f app.log"
else
    echo "❌ 백엔드 애플리케이션 시작 실패"
    echo "📋 오류 로그:"
    tail -20 app.log
fi

# 포트 확인
echo "🔍 포트 8080 확인 중..."
if netstat -tlnp | grep :8080; then
    echo "✅ 포트 8080에서 애플리케이션이 실행 중입니다."
else
    echo "❌ 포트 8080에서 애플리케이션이 실행되지 않습니다."
fi
EOF

chmod +x /home/ec2-user/start-backend.sh

echo "✅ 서버 설정 완료!"
echo "🌐 웹사이트: https://hmseok.com"
echo "🔧 API: https://hmseok.com/api"
echo "📋 다음 단계:"
echo "1. SSL 인증서 발급: sudo certbot --nginx -d hmseok.com -d www.hmseok.com"
echo "2. 백엔드 배포: ./deploy-app.sh" 