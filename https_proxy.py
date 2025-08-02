#!/usr/bin/env python3
import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
import json
import ssl
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

class HTTPSProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            # API 요청을 백엔드로 프록시
            backend_url = f"http://localhost:8080{self.path}"
            try:
                req = urllib.request.Request(backend_url)
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            # 정적 파일 서빙 (간단한 응답)
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Car Repair Management System</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                    .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }
                    .api-info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
                    .endpoint { background: rgba(255,255,255,0.3); padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #4CAF50; }
                    .status { background: rgba(76, 175, 80, 0.3); padding: 15px; border-radius: 8px; margin: 20px 0; }
                    h1 { text-align: center; margin-bottom: 30px; }
                    a { color: #4CAF50; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚗 Car Repair Management System</h1>
                    
                    <div class="status">
                        <h2>✅ 시스템 상태</h2>
                        <p>백엔드 API가 정상적으로 실행되고 있습니다.</p>
                        <p><strong>서버:</strong> 43.201.22.55</p>
                        <p><strong>백엔드:</strong> 포트 8080 (정상 작동)</p>
                    </div>
                    
                    <div class="api-info">
                        <h2>📡 API 엔드포인트</h2>
                        <div class="endpoint">
                            <strong>GET /api/auth/roles</strong> - 사용자 역할 조회
                        </div>
                        <div class="endpoint">
                            <strong>POST /api/auth/register</strong> - 회원가입
                        </div>
                        <div class="endpoint">
                            <strong>POST /api/auth/login</strong> - 로그인
                        </div>
                    </div>
                    
                    <div class="api-info">
                        <h2>🔧 테스트 링크</h2>
                        <ul>
                            <li><a href="/api/auth/roles" target="_blank">역할 조회 테스트</a></li>
                            <li><a href="/h2-console" target="_blank">H2 데이터베이스 콘솔</a></li>
                        </ul>
                    </div>
                    
                    <div class="api-info">
                        <h2>🔒 HTTPS 설정</h2>
                        <p>현재 HTTP로 실행 중입니다. Let's Encrypt 인증서를 적용하려면:</p>
                        <ol>
                            <li>도메인을 서버에 연결</li>
                            <li>Nginx 설치 및 설정</li>
                            <li>Certbot으로 SSL 인증서 발급</li>
                        </ol>
                    </div>
                </div>
            </body>
            </html>
            """
            self.wfile.write(html_content.encode('utf-8'))

    def do_POST(self):
        if self.path.startswith('/api/'):
            # POST 요청을 백엔드로 프록시
            backend_url = f"http://localhost:8080{self.path}"
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                req = urllib.request.Request(backend_url, data=post_data)
                req.add_header('Content-Type', self.headers['Content-Type'])
                
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        # CORS preflight 요청 처리
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

def create_self_signed_cert():
    """자체 서명된 SSL 인증서 생성 (임시용)"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        from datetime import datetime, timedelta
        import ipaddress
        
        # 개인키 생성
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # 인증서 생성
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, u"KR"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, u"Seoul"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, u"Seoul"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, u"Test Organization"),
            x509.NameAttribute(NameOID.COMMON_NAME, u"43.201.22.55"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.utcnow()
        ).not_valid_after(
            datetime.utcnow() + timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.IPAddress(ipaddress.IPv4Address("43.201.22.55")),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # 파일로 저장
        with open("server.key", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        with open("server.crt", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        return True
    except Exception as e:
        print(f"Failed to create certificate: {e}")
        return False

if __name__ == '__main__':
    PORT = 443
    
    # 자체 서명된 인증서 생성
    if create_self_signed_cert():
        print("Self-signed certificate created successfully")
        
        # SSL 컨텍스트 설정
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain('server.crt', 'server.key')
        
        with socketserver.TCPServer(("", PORT), HTTPSProxyHandler) as httpd:
            httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
            print(f"HTTPS Proxy server running on port {PORT}")
            print(f"Backend API: http://localhost:8080")
            print(f"Frontend: https://43.201.22.55")
            httpd.serve_forever()
    else:
        print("Using HTTP only...")
        PORT = 8084
        with socketserver.TCPServer(("", PORT), HTTPSProxyHandler) as httpd:
            print(f"HTTP Proxy server running on port {PORT}")
            print(f"Backend API: http://localhost:8080")
            print(f"Frontend: http://43.201.22.55:{PORT}")
            httpd.serve_forever() 