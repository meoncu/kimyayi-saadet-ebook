import http.server
import socketserver
import os
import webbrowser
import socket

PORT = 8085
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "www")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    local_ip = get_ip()
    print("=" * 60)
    print("  KİMYÂ-YI SAÂDET (İMAM GAZÂLÎ) E-KİTAP OKUYUCU BAŞLATILDI")
    print("=" * 60)
    print(f"  Tarayıcıda / Bilgisayarda Açmak İçin : http://localhost:{PORT}")
    print(f"  Android Telefondan Açmak İçin (Aynı Wi-Fi): http://{local_ip}:{PORT}")
    print("=" * 60)
    print("  Durdurmak için Ctrl+C tuşlarına basabilirsiniz.")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nSunucu kapatıldı.")
