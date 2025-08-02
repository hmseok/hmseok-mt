#!/usr/bin/env python3
import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
import json
import ssl
import ipaddress
from http.server import HTTPServer, BaseHTTPRequestHandler

class SSLProxyHandler(BaseHTTPRequestHandler):
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
            self.wfile.write(b'<h1>HTTPS Server is running!</h1><p>Backend API is available at /api/</p>')

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
    """자체 서명된 SSL 인증서 생성"""
    from cryptography import x509
    from cryptography.x509.oid import NameOID
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    from datetime import datetime, timedelta
    
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

if __name__ == '__main__':
    PORT = 8082
    
    # 자체 서명된 인증서 생성
    try:
        create_self_signed_cert()
        print("Self-signed certificate created successfully")
    except Exception as e:
        print(f"Failed to create certificate: {e}")
        print("Using HTTP only...")
    
    with socketserver.TCPServer(("", PORT), SSLProxyHandler) as httpd:
        print(f"HTTP Proxy server running on port {PORT}")
        httpd.serve_forever() 