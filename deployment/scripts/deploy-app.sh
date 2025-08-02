#!/bin/bash

echo "📦 애플리케이션 배포 시작..."

# 1. 백엔드 JAR 파일 업로드
echo "🔧 백엔드 배포 중..."
scp -i hmseok-mt.pem backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar ec2-user@54.180.88.243:/home/ec2-user/

# 2. 프론트엔드 파일 업로드
echo "🎨 프론트엔드 배포 중..."
scp -i hmseok-mt.pem -r frontend/dist/* ec2-user@54.180.88.243:/tmp/frontend/

# 3. 설치 스크립트 업로드
echo "📝 설치 스크립트 업로드 중..."
scp -i hmseok-mt.pem install-script.sh nginx-config.conf ec2-user@54.180.88.243:/home/ec2-user/

# 4. EC2에서 애플리케이션 시작
echo "🚀 애플리케이션 시작 중..."
ssh -i hmseok-mt.pem ec2-user@54.180.88.243 << 'EOF'
    # 기존 프로세스 종료
    pkill -f car-repair-estimate || true
    
    # Java 21 설치 확인 및 설치
    if ! java -version 2>&1 | grep -q "version \"21"; then
        echo "Java 21 설치 중..."
        sudo yum update -y
        sudo yum install java-21-amazon-corretto -y
    fi
    
    # Java 21 경로 설정
    export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto
    
    # 프론트엔드 파일 배포
    sudo cp -r /tmp/frontend/* /var/www/html/
    sudo chown -R nginx:nginx /var/www/html
    sudo chmod -R 755 /var/www/html
    
    # 백엔드 애플리케이션 시작 (Java 21 사용)
    nohup $JAVA_HOME/bin/java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    
    echo "✅ 애플리케이션 배포 완료!"
    echo "🌐 웹사이트: https://hmseok.com"
    echo "🔧 API: https://hmseok.com/api"
    echo "📋 로그 확인: tail -f app.log"
EOF

echo "🎉 배포 완료!" 