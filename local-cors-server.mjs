import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] || __dirname);
const port = Number(process.env.PORT || process.argv[3] || 5510);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  setCorsHeaders(res);
  res.writeHead(code, { 'Content-Type': type });
  if (body !== null) res.end(body);
  else res.end();
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    send(res, 400, 'Bad Request');
    return;
  }

  if (req.method === 'OPTIONS') {
    send(res, 204, null);
    return;
  }

  if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
    send(res, 405, 'Method Not Allowed');
    return;
  }

  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`).pathname);
  const normalized = requestPath.endsWith('/') ? `${requestPath}index.html` : requestPath;
  const target = path.resolve(root, `.${normalized}`);

  if (!target.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.stat(target, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(res, 404, 'Not Found');
      return;
    }

    const type = contentTypes[path.extname(target).toLowerCase()] || 'application/octet-stream';
    setCorsHeaders(res);
    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': type,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(target).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`local-cors-server ready: http://127.0.0.1:${port}/`);
  console.log(`local-cors-server ready: http://localhost:${port}/`);
  console.log(`serving: ${root}`);
});
