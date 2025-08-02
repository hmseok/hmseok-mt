#!/bin/bash

echo "🚀 EC2 서버 설정 시작..."

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

# 7. Nginx 설정 파일 적용
echo "📝 Nginx 설정 적용 중..."
sudo cp nginx-config.conf /etc/nginx/conf.d/hmseok.com.conf

# 8. Nginx 설정 테스트 및 재시작
echo "✅ Nginx 설정 테스트 중..."
sudo nginx -t
sudo systemctl restart nginx

# 9. SSL 인증서 발급
echo "🔒 SSL 인증서 발급 중..."
sudo certbot --nginx -d hmseok.com -d www.hmseok.com --non-interactive --agree-tos --email admin@hmseok.com

# 10. 자동 갱신 설정
echo "🔄 자동 갱신 설정 중..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

# 11. 프론트엔드 디렉토리 생성
echo "📁 프론트엔드 디렉토리 생성 중..."
sudo mkdir -p /var/www/html

echo "✅ 서버 설정 완료!"
echo "🌐 웹사이트: https://hmseok.com"
echo "🔧 API: https://hmseok.com/api" 