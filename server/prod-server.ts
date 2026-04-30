/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
// 独立的生产服务器 - 使用 CommonJS 避免 ESM 问题
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const distPath = path.resolve(process.cwd(), 'dist');

// 静态文件服务
app.use(express.static(distPath));

// SPA fallback
app.use((_req: any, res: any) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, () => {
  console.log(`\n✨ Server running at http://localhost:${port}`);
  console.log('📦 Production mode - serving static files\n');
});
