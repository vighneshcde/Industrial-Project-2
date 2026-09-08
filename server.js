// A zero-dependency local server for the interactive AegisFlow demo.
// It keeps the dashboard usable on machines where Python is not installed.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon'
};

function sendJson(response, status, data) {
  const body = JSON.stringify(data);
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(body);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  // The UI has local demo fallbacks. Returning a clear JSON error makes those fallbacks reliable.
  if (url.pathname.startsWith('/api/')) {
    return sendJson(response, 503, {
      error: 'Demo API is offline. The dashboard is running in local demo mode.',
      demo_mode: true
    });
  }

  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = path.resolve(root, `.${requested}`);
  if (!filePath.startsWith(root + path.sep) && filePath !== path.join(root, 'index.html')) {
    response.writeHead(403); response.end('Forbidden'); return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Unable to load file');
      return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`AegisFlow demo is ready at http://localhost:${port}`);
  console.log('Running in local demo mode. Payments and mailbox connections are simulated.');
});

server.on('error', error => {
  console.error(`Could not start AegisFlow: ${error.message}`);
  process.exitCode = 1;
});
