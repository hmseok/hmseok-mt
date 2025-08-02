#!/usr/bin/env python3
import http.server
import socketserver
import ssl
import urllib.request
import urllib.parse
import urllib.error
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

class HTTPSWebServer(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            # API 요청을 백엔드로 프록시
            backend_url = f"http://localhost:8081{self.path}"
            try:
                req = urllib.request.Request(backend_url)
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            # 정적 파일 서빙
            file_path = self.path.lstrip('/')
            if not file_path:
                file_path = 'index.html'
            
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                # 파일 타입 결정
                if file_path.endswith('.html'):
                    content_type = 'text/html'
                elif file_path.endswith('.js'):
                    content_type = 'application/javascript'
                elif file_path.endswith('.css'):
                    content_type = 'text/css'
                else:
                    content_type = 'application/octet-stream'
                
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                # 파일이 없으면 index.html로 리다이렉트
                try:
                    with open('index.html', 'rb') as f:
                        content = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html')
                    self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                    self.end_headers()
                    self.wfile.write(content)
                except:
                    self.send_response(404)
                    self.end_headers()

    def do_POST(self):
        if self.path.startswith('/api/'):
            # POST 요청을 백엔드로 프록시
            backend_url = f"http://localhost:8081{self.path}"
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                req = urllib.request.Request(backend_url, data=post_data)
                req.add_header('Content-Type', self.headers['Content-Type'])
                
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        # CORS preflight 요청 처리
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'https://hmseok.com, https://www.hmseok.com, http://hmseok.com, http://www.hmseok.com')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

def create_self_signed_cert():
    """자체 서명 SSL 인증서 생성"""
    import subprocess
    import os
    
    if not os.path.exists('ssl'):
        os.makedirs('ssl')
    
    # SSL 인증서 생성
    cmd = [
        'openssl', 'req', '-x509', '-newkey', 'rsa:4096',
        '-keyout', 'ssl/key.pem', '-out', 'ssl/cert.pem',
        '-days', '365', '-nodes',
        '-subj', '/CN=hmseok.com'
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print("SSL 인증서 생성 완료")
        return True
    except subprocess.CalledProcessError:
        print("SSL 인증서 생성 실패")
        return False

if __name__ == '__main__':
    # SSL 인증서 생성
    if not create_self_signed_cert():
        print("SSL 인증서 생성에 실패했습니다. HTTP로 실행합니다.")
        PORT = 80
        try:
            with socketserver.TCPServer(("", PORT), HTTPSWebServer) as httpd:
                print(f"HTTP 서버가 포트 {PORT}에서 실행 중입니다")
                print(f"도메인: http://hmseok.com")
                httpd.serve_forever()
        except PermissionError:
            print(f"포트 {PORT}에 대한 권한이 없습니다. 포트 8080으로 시도합니다.")
            PORT = 8080
            with socketserver.TCPServer(("", PORT), HTTPSWebServer) as httpd:
                print(f"HTTP 서버가 포트 {PORT}에서 실행 중입니다")
                print(f"도메인: http://hmseok.com:{PORT}")
                httpd.serve_forever()
    else:
        # HTTPS 서버 실행
        PORT = 443
        try:
            with socketserver.TCPServer(("", PORT), HTTPSWebServer) as httpd:
                httpd.socket = ssl.wrap_socket(httpd.socket, 
                                             certfile='ssl/cert.pem', 
                                             keyfile='ssl/key.pem', 
                                             server_side=True)
                print(f"HTTPS 서버가 포트 {PORT}에서 실행 중입니다")
                print(f"도메인: https://hmseok.com")
                httpd.serve_forever()
        except PermissionError:
            print(f"포트 {PORT}에 대한 권한이 없습니다. 포트 8443으로 시도합니다.")
            PORT = 8443
            with socketserver.TCPServer(("", PORT), HTTPSWebServer) as httpd:
                httpd.socket = ssl.wrap_socket(httpd.socket, 
                                             certfile='ssl/cert.pem', 
                                             keyfile='ssl/key.pem', 
                                             server_side=True)
                print(f"HTTPS 서버가 포트 {PORT}에서 실행 중입니다")
                print(f"도메인: https://hmseok.com:{PORT}")
                httpd.serve_forever() 