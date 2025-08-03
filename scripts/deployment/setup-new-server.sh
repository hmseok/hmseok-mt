#!/bin/bash

echo "🚀 새 EC2 서버 설정 시작..."

# 시스템 업데이트
echo "📦 시스템 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# Java 21 설치
echo "☕ Java 21 설치 중..."
sudo apt install -y openjdk-21-jdk

# Nginx 설치
echo "🌐 Nginx 설치 중..."
sudo apt install -y nginx

# Nginx 설정
echo "🔧 Nginx 설정 중..."
sudo systemctl enable nginx
sudo systemctl start nginx

# 방화벽 설정
echo "🔥 방화벽 설정 중..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
sudo ufw --force enable

# Certbot 설치
echo "🔒 Certbot 설치 중..."
sudo apt install -y certbot python3-certbot-nginx

# 프론트엔드 디렉토리 생성
echo "📁 프론트엔드 디렉토리 생성 중..."
sudo mkdir -p /var/www/html
sudo chown -R ubuntu:ubuntu /var/www/html

# 백엔드 디렉토리 생성
echo "📁 백엔드 디렉토리 생성 중..."
mkdir -p /home/ubuntu/app

# Nginx 설정 파일 생성
echo "📝 Nginx 설정 파일 생성 중..."
sudo tee /etc/nginx/sites-available/hmseok.com > /dev/null << 'EOF'
server {
    listen 80;
    server_name hmseok.com www.hmseok.com;
    
    # 프론트엔드 파일 서빙
    root /var/www/html;
    index index.html;
    
    # React Router를 위한 설정
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 백엔드 API 프록시
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Nginx 설정 활성화
sudo ln -sf /etc/nginx/sites-available/hmseok.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
echo "✅ Nginx 설정 테스트 중..."
sudo nginx -t

# 백엔드 시작 스크립트 생성
echo "📝 백엔드 시작 스크립트 생성 중..."
tee /home/ubuntu/start-backend.sh > /dev/null << 'EOF'
#!/bin/bash

# 기존 백엔드 프로세스 종료
pkill -f "car-repair-estimate"

# Java 21 경로 설정
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# 백엔드 애플리케이션 시작
cd /home/ubuntu
nohup java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

echo "✅ 백엔드 애플리케이션이 시작되었습니다."
echo "📋 로그 확인: tail -f app.log"
EOF

chmod +x /home/ubuntu/start-backend.sh

echo "✅ 서버 설정 완료!"
echo "🌐 웹사이트: https://hmseok.com"
echo "🔧 API: https://hmseok.com/api"
echo "📋 다음 단계:"
echo "1. SSL 인증서 발급: sudo certbot --nginx -d hmseok.com -d www.hmseok.com"
echo "2. 백엔드 배포: ./deploy-app.sh" 