#!/bin/bash

# EC2 배포 스크립트
echo "🚀 EC2에 백엔드 배포를 시작합니다..."

# 백엔드 빌드
echo "📦 백엔드 빌드 중..."
cd backend
./gradlew clean build -x test

# JAR 파일 확인
if [ ! -f "build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ JAR 파일 생성 실패"
    exit 1
fi

echo "✅ 백엔드 빌드 완료"

# EC2 인스턴스 정보
EC2_HOST="54.180.88.243"
EC2_USER="ec2-user"
EC2_KEY="hmseok-mt.pem"

echo "🌐 EC2 인스턴스: $EC2_HOST"

# 키 파일 확인
if [ ! -f "../$EC2_KEY" ]; then
    echo "❌ 키 파일을 찾을 수 없습니다: $EC2_KEY"
    echo "키 파일을 프로젝트 루트에 저장하세요."
    exit 1
fi

# 키 파일 권한 설정
chmod 400 "../$EC2_KEY"

# JAR 파일을 EC2로 전송
echo "📤 JAR 파일을 EC2로 전송 중..."
scp -i "../$EC2_KEY" build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar $EC2_USER@$EC2_HOST:/home/$EC2_USER/

# EC2에서 애플리케이션 실행
echo "🔧 EC2에서 애플리케이션 시작 중..."
ssh -i "../$EC2_KEY" $EC2_USER@$EC2_HOST << 'EOF'
    # Java 설치 확인
    if ! command -v java &> /dev/null; then
        echo "Java 설치 중..."
        sudo yum update -y
        sudo yum install java-21-amazon-corretto -y
    fi
    
    # 기존 프로세스 종료
    pkill -f car-repair-estimate || true
    
    # 애플리케이션 시작
    nohup java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
    
    echo "✅ 애플리케이션이 백그라운드에서 시작되었습니다"
    echo "📋 로그 확인: tail -f app.log"
EOF

echo "🎉 배포 완료!"
echo "🌐 API 엔드포인트: http://$EC2_HOST:8080" 