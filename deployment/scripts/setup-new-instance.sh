#!/bin/bash

# 새로운 EC2 인스턴스 초기 셋팅 스크립트
# 사용법: ./setup-new-instance.sh <NEW_INSTANCE_IP>

if [ $# -eq 0 ]; then
    echo "사용법: $0 <NEW_INSTANCE_IP>"
    echo "예시: $0 1.2.3.4"
    exit 1
fi

NEW_INSTANCE_IP=$1
PEM_FILE="~/.ssh/RIDE-EBOT-KR.pem"

echo "=== 새로운 인스턴스 초기 셋팅 시작 ==="
echo "인스턴스 IP: $NEW_INSTANCE_IP"

# 1. 연결 테스트
echo "1. SSH 연결 테스트..."
ssh -i $PEM_FILE -o StrictHostKeyChecking=no ec2-user@$NEW_INSTANCE_IP "echo 'SSH 연결 성공!'"

# 2. 시스템 업데이트
echo "2. 시스템 업데이트..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo yum update -y"

# 3. Java 21 설치
echo "3. Java 21 설치..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo yum install java-21-amazon-corretto -y"

# 4. Git 설치
echo "4. Git 설치..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo yum install git -y"

# 5. Nginx 설치
echo "5. Nginx 설치..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo yum install nginx -y"

# 6. 프로젝트 클론
echo "6. 프로젝트 클론..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "cd /home/ec2-user && git clone https://github.com/hmseok/hmseok-mt.git"

# 7. 백엔드 빌드
echo "7. 백엔드 빌드..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "cd /home/ec2-user/hmseok-mt/backend && ./gradlew build -x test"

# 8. Nginx 설정
echo "8. Nginx 설정..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo cp /home/ec2-user/hmseok-mt/deployment/config/nginx-fixed.conf /etc/nginx/conf.d/hmseok.com.conf"
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo ln -sf /etc/nginx/conf.d/hmseok.com.conf /etc/nginx/sites-enabled/"
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "sudo nginx -t && sudo systemctl enable nginx && sudo systemctl start nginx"

# 9. 백엔드 애플리케이션 시작
echo "9. 백엔드 애플리케이션 시작..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "cd /home/ec2-user/hmseok-mt/backend && nohup java -jar build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &"

# 10. 연결 테스트
echo "10. 네트워크 연결 테스트..."
ssh -i $PEM_FILE ec2-user@$NEW_INSTANCE_IP "ping -c 3 8.8.8.8"

echo "=== 초기 셋팅 완료 ==="
echo "새 인스턴스 IP: $NEW_INSTANCE_IP"
echo "애플리케이션 확인: http://$NEW_INSTANCE_IP"
echo "API 테스트: http://$NEW_INSTANCE_IP/api/auth/roles" 