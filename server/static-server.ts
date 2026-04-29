// 纯生产服务器 - 不依赖 Vite
import express from 'express';
import path from 'path';
import fs from 'fs';

const port = parseInt(process.env.DEPLOY_RUN_PORT || '5000', 10);
const app = express();

// 请求日志
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${ms}ms`);
  });
  next();
});

// 添加请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件服务
const distPath = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found. Please run "pnpm build" first.');
  process.exit(1);
}

app.use(express.static(distPath));

// SPA fallback
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`\n✨ Server running at http://0.0.0.0:${port}`);
  console.log(`📦 Environment: production`);
  console.log(`📁 Serving static files from dist/\n`);
});
