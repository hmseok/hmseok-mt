#!/bin/bash

echo "🚀 AWS Systems Manager를 사용한 배포 시작..."

# 환경 변수 설정
DOMAIN="hmseok.com"
EC2_INSTANCE_ID="i-xxxxxxxxx"  # EC2 인스턴스 ID 필요
AWS_REGION="ap-northeast-2"

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

# 4. S3에 업로드
echo "☁️ S3에 업로드 중..."
aws s3 cp deploy/ s3://hmseok-mt-deploy/ --recursive

# 5. Systems Manager로 명령 실행
echo "🔧 EC2 서버 설정 중..."

# 시스템 업데이트 및 패키지 설치
aws ssm send-command \
  --instance-ids $EC2_INSTANCE_ID \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "sudo yum update -y",
    "sudo yum install java-21-amazon-corretto nginx firewalld -y",
    "sudo systemctl start nginx",
    "sudo systemctl enable nginx",
    "sudo systemctl start firewalld",
    "sudo systemctl enable firewalld",
    "sudo firewall-cmd --permanent --add-service=http",
    "sudo firewall-cmd --permanent --add-service=https",
    "sudo firewall-cmd --permanent --add-service=ssh",
    "sudo firewall-cmd --reload",
    "sudo yum install epel-release -y",
    "sudo yum install certbot python3-certbot-nginx -y"
  ]' \
  --region $AWS_REGION

# 6. 애플리케이션 배포
echo "📦 애플리케이션 배포 중..."
aws ssm send-command \
  --instance-ids $EC2_INSTANCE_ID \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "aws s3 cp s3://hmseok-mt-deploy/ /tmp/deploy/ --recursive",
    "sudo mkdir -p /var/www/html",
    "sudo cp -r /tmp/deploy/static/* /var/www/html/",
    "sudo chown -R nginx:nginx /var/www/html",
    "sudo chmod -R 755 /var/www/html",
    "pkill -f car-repair-estimate || true",
    "nohup java -jar /tmp/deploy/car-repair-estimate-0.0.1-SNAPSHOT.jar > /home/ec2-user/app.log 2>&1 &"
  ]' \
  --region $AWS_REGION

echo "✅ 배포 완료!"
echo "🌐 웹사이트: https://$DOMAIN"
echo "🔧 API: https://$DOMAIN/api"

# 정리
rm -rf deploy 