#!/bin/bash

# EC2 배포 스크립트
# 사용법: ./deploy-to-ec2.sh

# 설정
EC2_HOST="54.180.88.243"
EC2_USER="ec2-user"
KEY_FILE="hmseok-mt.pem"  # 프로젝트 루트에 저장
APP_NAME="car-repair-backend"

echo "🚀 EC2 배포 시작..."

# 키 파일 확인
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ 키 파일을 찾을 수 없습니다: $KEY_FILE"
    echo "다음 위치에서 키 파일을 확인하세요:"
    echo "1. 프로젝트 루트 디렉토리"
    echo "2. ~/.ssh/ 디렉토리"
    echo "3. 다운로드 폴더"
    echo ""
    echo "키 파일이 다른 이름으로 저장되어 있다면 KEY_FILE 변수를 수정하세요."
    exit 1
fi

# 키 파일 권한 설정
chmod 400 "$KEY_FILE"

# 1. 백엔드 빌드
echo "📦 백엔드 빌드 중..."
cd backend
./gradlew build -x test

# 2. JAR 파일 생성 확인
if [ ! -f "build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ JAR 파일 생성 실패"
    exit 1
fi

# 3. EC2에 파일 업로드
echo "📤 EC2에 파일 업로드 중..."
scp -i "../$KEY_FILE" build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar $EC2_USER@$EC2_HOST:~/$APP_NAME.jar

# 4. EC2에서 애플리케이션 실행
echo "🔧 EC2에서 애플리케이션 설정 중..."
ssh -i "$KEY_FILE" $EC2_USER@$EC2_HOST << 'EOF'
    # Java 설치 확인
    if ! command -v java &> /dev/null; then
        echo "Java 설치 중..."
        sudo yum update -y
        sudo yum install java-21-amazon-corretto -y
    fi
    
    # 애플리케이션 디렉토리 생성
    mkdir -p ~/app
    
    # 기존 프로세스 종료
    pkill -f car-repair-backend || true
    
    # 애플리케이션 실행
    nohup java -jar ~/car-repair-backend.jar --spring.profiles.active=prod > ~/app/app.log 2>&1 &
    
    echo "애플리케이션이 백그라운드에서 실행 중입니다."
    echo "로그 확인: tail -f ~/app/app.log"
EOF

echo "✅ 배포 완료!"
echo "🌐 애플리케이션 URL: http://$EC2_HOST:8080"
echo "📊 Swagger UI: http://$EC2_HOST:8080/swagger-ui/index.html" 