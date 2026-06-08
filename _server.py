import http.server
import os
import pathlib

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='D:\\新建文件夹\\000', **kwargs)

    def do_GET(self):
        # Dir listing disabled
        p = pathlib.Path('D:\\新建文件夹\\000') / self.path.lstrip('/')
        if not self.path.endswith('/') and p.is_dir() and (p / 'index.html').exists():
            self.path = self.path.rstrip('/') + '/index.html'
        super().do_GET()

    def list_directory(self, path):
        self.send_error(404, 'Not Found')

addr = ('', 3000)
with http.server.HTTPServer(addr, Handler) as srv:
    srv.serve_forever()
