#!/bin/bash

# GitHub Actions 배포 스크립트
# EC2 서버에서 실행됨

set -e

echo "🚀 GitHub Actions 배포 시작..."

# 환경 변수 확인
if [ -z "$DEPLOY_TYPE" ]; then
    DEPLOY_TYPE="both"
fi

# 프론트엔드 배포
if [ "$DEPLOY_TYPE" = "frontend" ] || [ "$DEPLOY_TYPE" = "both" ]; then
    echo "📦 프론트엔드 배포 중..."
    
    # 빌드된 파일들이 /tmp/frontend-deploy에 있다고 가정
    if [ -d "/tmp/frontend-deploy" ]; then
        echo "프론트엔드 파일 복사 중..."
        sudo cp -r /tmp/frontend-deploy/* /var/www/html/
        
        # index.html의 JS 파일 경로 업데이트
        LATEST_JS=$(ls /var/www/html/main.*.js | head -1 | xargs basename)
        if [ ! -z "$LATEST_JS" ]; then
            sudo sed -i "s/main\.[a-zA-Z0-9]*\.js/$LATEST_JS/g" /var/www/html/index.html
            echo "JS 파일 경로 업데이트: $LATEST_JS"
        fi
        
        # 권한 설정
        sudo chown -R www-data:www-data /var/www/html/
        sudo chmod -R 755 /var/www/html/
        
        echo "✅ 프론트엔드 배포 완료"
    else
        echo "⚠️  프론트엔드 파일을 찾을 수 없습니다"
    fi
fi

# 백엔드 배포
if [ "$DEPLOY_TYPE" = "backend" ] || [ "$DEPLOY_TYPE" = "both" ]; then
    echo "🔧 백엔드 배포 중..."
    
    # 서비스 중지
    echo "백엔드 서비스 중지 중..."
    sudo systemctl stop car-repair || true
    
    # 새 JAR 파일 복사
    if [ -f "/tmp/backend-deploy/car-repair-estimate-0.0.1-SNAPSHOT.jar" ]; then
        echo "새 JAR 파일 복사 중..."
        sudo cp /tmp/backend-deploy/car-repair-estimate-0.0.1-SNAPSHOT.jar /home/ubuntu/
        sudo chown ubuntu:ubuntu /home/ubuntu/car-repair-estimate-0.0.1-SNAPSHOT.jar
        sudo chmod 755 /home/ubuntu/car-repair-estimate-0.0.1-SNAPSHOT.jar
    else
        echo "⚠️  백엔드 JAR 파일을 찾을 수 없습니다"
    fi
    
    # 서비스 재시작
    echo "백엔드 서비스 재시작 중..."
    sudo systemctl start car-repair
    
    # 서비스 상태 확인
    sleep 5
    if sudo systemctl is-active --quiet car-repair; then
        echo "✅ 백엔드 배포 완료"
    else
        echo "❌ 백엔드 서비스 시작 실패"
        sudo systemctl status car-repair
        exit 1
    fi
fi

echo "🎉 배포 완료!" 