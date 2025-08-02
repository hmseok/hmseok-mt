#!/bin/bash

echo "🚀 백엔드 애플리케이션 시작 스크립트"

# 1. Java 21 설치 확인
echo "☕ Java 21 설치 확인 중..."
if ! java -version 2>&1 | grep -q "version \"21"; then
    echo "Java 21 설치 중..."
    sudo yum update -y
    sudo yum install java-21-amazon-corretto -y
fi

# 2. Java 21 경로 설정
export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto
echo "Java 경로: $JAVA_HOME"

# 3. 기존 프로세스 종료
echo "🔧 기존 프로세스 종료 중..."
pkill -f car-repair-estimate || true
sleep 2

# 4. 백엔드 JAR 파일 확인
echo "📦 JAR 파일 확인 중..."
if [ ! -f "car-repair-estimate-0.0.1-SNAPSHOT.jar" ]; then
    echo "❌ JAR 파일이 없습니다!"
    exit 1
fi

# 5. 백엔드 애플리케이션 시작
echo "🚀 백엔드 애플리케이션 시작 중..."
nohup $JAVA_HOME/bin/java -jar car-repair-estimate-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 6. 프로세스 ID 확인
sleep 5
PID=$(pgrep -f car-repair-estimate)
if [ -n "$PID" ]; then
    echo "✅ 백엔드 애플리케이션이 시작되었습니다. PID: $PID"
    echo "📋 로그 확인: tail -f app.log"
else
    echo "❌ 백엔드 애플리케이션 시작 실패"
    echo "📋 오류 로그:"
    tail -20 app.log
fi

# 7. 포트 확인
echo "🔍 포트 8080 확인 중..."
if netstat -tlnp | grep :8080; then
    echo "✅ 포트 8080에서 애플리케이션이 실행 중입니다."
else
    echo "❌ 포트 8080에서 애플리케이션이 실행되지 않습니다."
fi 