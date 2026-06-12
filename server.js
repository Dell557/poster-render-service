/**
 * 海报渲染API服务 v2.0（模块化重构版）
 * 支持博士版/教授版双版式
 * 使用 Vite 构建的 React 前端 + Playwright 截图
 */

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 导入日志模块
const logger = require('./utils/logger');

// 导入配置
const { PORT, API_AUTH_TOKEN, distDir, imagesDir, publicDir, POSTER_VERSIONS, apiDocumentation } = require('./config/constants');

// 导入中间件
const { authGuard, basicAuthGuard } = require('./middleware/auth');

// 导入路由
const renderRoutes = require('./routes/renderRoutes');
const dbRoutes = require('./routes/dbRoutes');
const uiRoutes = require('./routes/uiRoutes');

// 全局错误处理 - 防止未捕获异常导致服务崩溃
process.on('uncaughtException', (error) => {
  logger.error('❌ 未捕获的异常:', { message: error.message, stack: error.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ 未处理的 Promise 拒绝:', { reason: reason?.message || reason });
});

// 验证必要的环境变量
if (!API_AUTH_TOKEN) {
  logger.error('❌ 缺少必要的环境变量: API_AUTH_TOKEN');
  logger.error('请在 .env 文件中配置 API_AUTH_TOKEN');
  process.exit(1);
}

// 确保必要目录存在
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'ui'), { recursive: true });

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  const { method, originalUrl, ip, headers } = req;
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    const logData = {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: headers['user-agent']
    };
    
    if (statusCode >= 400) {
      logger.warn('请求异常', logData);
    } else {
      logger.http('请求完成', logData);
    }
  });
  
  next();
});

// 静态文件：图片公开访问
app.use('/images', express.static(imagesDir));

// 静态文件：构建产物（用于预览）
app.use('/preview', express.static(distDir));

// 健康检查（无需鉴权）
app.get('/health', (req, res) => {
  const buildExists = fs.existsSync(path.join(distDir, 'index.html'));
  logger.info('健康检查', { buildExists });
  
  res.json({
    success: true,
    message: '海报渲染服务运行正常',
    timestamp: new Date().toISOString(),
    version: apiDocumentation.version,
    supportedVersions: POSTER_VERSIONS,
    buildExists
  });
});

// 根路径重定向到UI控制台
app.get('/', (req, res) => {
  logger.info('根路径访问，重定向到 /ui');
  res.redirect('/ui');
});

// API 路由鉴权
app.use('/api', authGuard);

// 注册渲染路由
app.use('/api', renderRoutes);

// 注册数据库路由
app.use('/api/db', dbRoutes);

// UI 控制台 - 基础账号鉴权（先注册路由，再静态文件）
app.use('/ui', basicAuthGuard, uiRoutes);
app.use('/ui', basicAuthGuard, express.static(path.join(publicDir, 'ui')));

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method 
  });
  
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  logger.warn('404 未找到', { url: req.originalUrl, method: req.method });
  res.status(404).json({
    success: false,
    error: '未找到请求的资源'
  });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info('\n🚀 海报渲染服务 v2.0 已启动');
  logger.info(`📡 服务地址: http://localhost:${PORT}`);
  logger.info(`🎨 支持版式: ${POSTER_VERSIONS.join(', ')}`);
  logger.info(`🔐 API 鉴权: Authorization Bearer 或 X-API-Key 头`);
  logger.info(`🔐 UI 鉴权: 浏览器登录 (账户: zkyc, 密码: Zkyc@565758)`);
  
  const buildExists = fs.existsSync(path.join(distDir, 'index.html'));
  logger.info(`📁 构建状态: ${buildExists ? '✅ 已构建' : '⚠️  需要运行 npm run build'}`);
  
  logger.info('\n📋 可用API:');
  apiDocumentation.endpoints.forEach(ep => {
    logger.info(`   - ${ep.method.padEnd(4)} ${ep.path.padEnd(35)} - ${ep.description}`);
  });
  
  logger.info('\n✅ 服务启动成功，等待请求...\n');
});