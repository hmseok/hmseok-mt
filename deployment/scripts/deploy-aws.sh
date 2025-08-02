#!/bin/bash

echo "🚀 AWS 배포 시작..."

# 1. 백엔드 빌드
echo "📦 백엔드 빌드 중..."
cd backend
./gradlew clean build -x test
cd ..

# 2. 프론트엔드 빌드
echo "🎨 프론트엔드 빌드 중..."
cd frontend
npm run build
cd ..

# 3. 배포 패키지 생성
echo "📦 배포 패키지 생성 중..."
mkdir -p deploy
cp backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar deploy/
cp -r frontend/dist deploy/static
cp backend/.ebextensions deploy/ -r
cp backend/Procfile deploy/

# 4. 배포 패키지 압축
echo "🗜️ 배포 패키지 압축 중..."
cd deploy
zip -r ../car-repair-deploy.zip .
cd ..

echo "✅ 배포 준비 완료!"
echo "📦 배포 파일: car-repair-deploy.zip"
echo ""
echo "다음 단계:"
echo "1. AWS Elastic Beanstalk 콘솔에 접속"
echo "2. 새 애플리케이션 생성"
echo "3. car-repair-deploy.zip 업로드"
echo "4. 환경 설정: Java 21, Tomcat 10"
echo ""
echo "또는 AWS CLI를 사용하여 배포:"
echo "aws elasticbeanstalk create-application-version --application-name car-repair-app --version-label v1 --source-bundle S3Bucket=your-bucket,S3Key=car-repair-deploy.zip" 