#!/usr/bin/env python3
import http.server, os

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a): pass  # silence logs

os.chdir(os.path.dirname(os.path.abspath(__file__)))
http.server.test(HandlerClass=NoCacheHandler, port=5500, bind='127.0.0.1')
