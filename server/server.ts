// ABOUTME: Express server - always serves static files from dist/
// ABOUTME: No Vite dev middleware to avoid esbuild compatibility issues

import { createServer } from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';

const port = parseInt(process.env.DEPLOY_RUN_PORT || process.env.PORT || '5000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const app = express();
const server = createServer(app);

const distPath = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found. Please run "pnpm build" first.');
  process.exit(1);
}

// 请求日志
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${ms}ms`);
  });
  next();
});

// 服务静态文件
app.use(express.static(distPath));

// SPA fallback - 所有未处理的请求返回 index.html
app.use((_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(port, () => {
  console.log(`\n✨ Server running at http://${hostname}:${port}\n`);
});
