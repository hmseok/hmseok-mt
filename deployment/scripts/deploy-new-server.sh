#!/bin/bash

echo "📦 새 서버 애플리케이션 배포 시작..."

# 새 서버 IP 주소 입력 (사용자가 입력해야 함)
read -p "새 EC2 인스턴스의 퍼블릭 IP 주소를 입력하세요: " SERVER_IP

if [ -z "$SERVER_IP" ]; then
    echo "❌ IP 주소를 입력해주세요."
    exit 1
fi

echo "🎯 대상 서버: $SERVER_IP"

# 1. 서버 설정 스크립트 업로드
echo "📝 서버 설정 스크립트 업로드 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no setup-new-server.sh ec2-user@$SERVER_IP:/home/ec2-user/

if [ $? -ne 0 ]; then
    echo "❌ 서버 설정 스크립트 업로드 실패"
    exit 1
fi

# 2. 서버 설정 실행
echo "🚀 서버 설정 실행 중..."
ssh -i hmseok-mt-new -o StrictHostKeyChecking=no ec2-user@$SERVER_IP << 'EOF'
    chmod +x setup-new-server.sh
    ./setup-new-server.sh
EOF

if [ $? -ne 0 ]; then
    echo "❌ 서버 설정 실패"
    exit 1
fi

# 3. 백엔드 JAR 파일 업로드
echo "🔧 백엔드 배포 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ec2-user@$SERVER_IP:/home/ec2-user/

if [ $? -ne 0 ]; then
    echo "❌ 백엔드 JAR 파일 업로드 실패"
    exit 1
fi

# 4. 프론트엔드 파일 업로드
echo "🎨 프론트엔드 배포 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no -r frontend/dist/* ec2-user@$SERVER_IP:/tmp/frontend/

if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 파일 업로드 실패"
    exit 1
fi

# 5. 애플리케이션 배포 및 시작
echo "🚀 애플리케이션 배포 및 시작 중..."
ssh -i hmseok-mt-new -o StrictHostKeyChecking=no ec2-user@$SERVER_IP << 'EOF'
    # 프론트엔드 파일 배포
    sudo cp -r /tmp/frontend/* /var/www/html/
    sudo chown -R nginx:nginx /var/www/html
    sudo chmod -R 755 /var/www/html
    
    # 백엔드 애플리케이션 시작
    ./start-backend.sh
    
    echo "✅ 애플리케이션 배포 완료!"
    echo "🌐 웹사이트: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
    echo "🔧 API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api"
    echo "📋 백엔드 로그: tail -f app.log"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 배포 완료!"
    echo "🔍 API 테스트 중..."
    sleep 10
    curl -X GET http://$SERVER_IP/api/cars
else
    echo "❌ 배포 실패"
    exit 1
fi 