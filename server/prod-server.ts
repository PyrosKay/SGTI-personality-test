// 独立的生产服务器
import express from 'express';
import path from 'path';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

const distPath = path.resolve(process.cwd(), 'dist');

// 静态文件服务
app.use(express.static(distPath));

// SPA fallback
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, () => {
  console.log(`\n✨ Server running at http://localhost:${port}`);
  console.log('📦 Production mode - serving static files\n');
});
