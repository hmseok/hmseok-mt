#!/bin/bash

echo "🔒 보안 그룹 설정 테스트"
echo "=========================="

# 서버 IP
SERVER_IP="43.201.22.156"

echo "🌐 HTTP 연결 테스트..."
curl -I http://$SERVER_IP

echo ""
echo "🔧 API 연결 테스트..."
curl -X GET http://$SERVER_IP/api/cars

echo ""
echo "🔐 HTTPS 연결 테스트..."
curl -I https://$SERVER_IP

echo ""
echo "📡 포트 스캔 테스트..."
nmap -p 22,80,443,8080 $SERVER_IP

echo ""
echo "✅ 테스트 완료!" 