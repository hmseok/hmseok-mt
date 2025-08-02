#!/usr/bin/env python3
import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleProxyHandler(BaseHTTPRequestHandler):
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
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .container { max-width: 800px; margin: 0 auto; }
                    .api-info { background: #f5f5f5; padding: 20px; border-radius: 5px; }
                    .endpoint { background: #e8f4fd; padding: 10px; margin: 10px 0; border-left: 4px solid #2196F3; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚗 Car Repair Management System</h1>
                    <p>백엔드 API가 정상적으로 실행되고 있습니다.</p>
                    
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
                    
                    <h2>🔧 테스트</h2>
                    <p>API 테스트를 위해 다음 URL을 사용하세요:</p>
                    <ul>
                        <li><a href="/api/auth/roles" target="_blank">역할 조회 테스트</a></li>
                        <li><a href="/h2-console" target="_blank">H2 데이터베이스 콘솔</a></li>
                    </ul>
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

if __name__ == '__main__':
    PORT = 8083
    with socketserver.TCPServer(("", PORT), SimpleProxyHandler) as httpd:
        print(f"HTTP Proxy server running on port {PORT}")
        print(f"Backend API: http://localhost:8080")
        print(f"Frontend: http://43.201.22.55:{PORT}")
        httpd.serve_forever() 