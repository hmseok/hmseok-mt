#!/bin/bash

echo "🚀 빠른 AWS 배포를 시작합니다..."

# 1. 백엔드 빌드
echo "📦 백엔드 빌드 중..."
cd backend
./gradlew build -x test
cd ..

# 2. JAR 파일을 EC2로 전송
echo "📤 JAR 파일을 EC2로 전송 중..."
scp -i hmseok-mt.pem backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ec2-user@54.180.88.243:/home/ec2-user/app.jar

# 3. EC2에서 애플리케이션 시작
echo "🔧 EC2에서 애플리케이션 시작 중..."
ssh -i hmseok-mt.pem ec2-user@54.180.88.243 << 'EOF'
    # 기존 프로세스 종료
    pkill -f "java.*app.jar" || true
    
    # 애플리케이션 시작
    nohup java -jar app.jar > app.log 2>&1 &
    
    echo "✅ 애플리케이션이 시작되었습니다!"
    echo "📊 로그 확인: tail -f app.log"
EOF

echo "✅ 배포 완료!"
echo "🌐 API 엔드포인트: http://54.180.88.243:8080" 