#!/bin/bash

echo "📦 애플리케이션 배포 시작 (수정된 버전)..."

# SSH 키 파일 확인
if [ ! -f "hmseok-mt-new" ]; then
    echo "❌ SSH 키 파일 hmseok-mt-new를 찾을 수 없습니다."
    exit 1
fi

# SSH 키 권한 설정
chmod 600 hmseok-mt-new

# 1. 백엔드 JAR 파일 업로드
echo "🔧 백엔드 배포 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ec2-user@54.180.88.243:/home/ec2-user/

if [ $? -ne 0 ]; then
    echo "❌ 백엔드 JAR 파일 업로드 실패"
    exit 1
fi

# 2. 프론트엔드 파일 업로드
echo "🎨 프론트엔드 배포 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no -r frontend/dist/* ec2-user@54.180.88.243:/tmp/frontend/

if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 파일 업로드 실패"
    exit 1
fi

# 3. 백엔드 시작 스크립트 업로드
echo "📝 백엔드 시작 스크립트 업로드 중..."
scp -i hmseok-mt-new -o StrictHostKeyChecking=no start-backend.sh ec2-user@54.180.88.243:/home/ec2-user/

if [ $? -ne 0 ]; then
    echo "❌ 백엔드 시작 스크립트 업로드 실패"
    exit 1
fi

# 4. EC2에서 애플리케이션 시작
echo "🚀 애플리케이션 시작 중..."
ssh -i hmseok-mt-new -o StrictHostKeyChecking=no ec2-user@54.180.88.243 << 'EOF'
    # 프론트엔드 파일 배포
    sudo cp -r /tmp/frontend/* /var/www/html/
    sudo chown -R nginx:nginx /var/www/html
    sudo chmod -R 755 /var/www/html
    
    # 백엔드 시작 스크립트 실행
    chmod +x start-backend.sh
    ./start-backend.sh
    
    echo "✅ 애플리케이션 배포 완료!"
    echo "🌐 웹사이트: https://hmseok.com"
    echo "🔧 API: https://hmseok.com/api"
    echo "📋 백엔드 로그: tail -f app.log"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 배포 완료!"
    echo "🔍 API 테스트 중..."
    sleep 10
    curl -X GET https://hmseok.com/api/cars
else
    echo "❌ 배포 실패"
    exit 1
fi 