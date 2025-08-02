#!/bin/bash

echo "🚀 Car Repair Management System 배포 시작..."

# 1. 프론트엔드 빌드
echo "📦 프론트엔드 빌드 중..."
cd frontend
npm run build
cd ..

# 2. 백엔드 빌드
echo "🔧 백엔드 빌드 중..."
cd backend
./gradlew build -x test
cd ..

# 3. Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드 중..."
docker-compose build

# 4. 컨테이너 실행
echo "🚀 컨테이너 실행 중..."
docker-compose up -d

echo "✅ 배포 완료!"
echo "🌐 웹사이트: http://localhost"
echo "🔧 API: http://localhost/api"
echo "📊 H2 콘솔: http://localhost/h2-console" 