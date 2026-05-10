from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SpaHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.startswith(("/api/", "/uploads/")):
            self.send_error(404)
            return
        return super().do_GET()

    def do_HEAD(self):
        if self.path.startswith(("/api/", "/uploads/")):
            self.send_error(404)
            return
        return super().do_HEAD()

    def send_error(self, code, message=None, explain=None):
        if code == 404 and not self.path.startswith(("/api/", "/uploads/")):
            self.path = "/index.html"
            return self.do_GET()
        return super().send_error(code, message, explain)


if __name__ == "__main__":
    handler = partial(SpaHandler, directory="/app/frontend/dist")
    server = ThreadingHTTPServer(("0.0.0.0", 3000), handler)
    print("Frontend static server running on http://0.0.0.0:3000", flush=True)
    server.serve_forever()
