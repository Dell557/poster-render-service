/**
 * 海报渲染API服务 v2.0
 * 支持博士版/教授版双版式
 * 使用 Vite 构建的 React 前端 + Playwright 截图
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const qrcode = require('qrcode');
const { chromium } = require('playwright');
require('dotenv').config();

// 数据库配置（延迟加载，仅在需要时导入）
let db = null;
function getDb() {
  if (!db) {
    db = require('./config/db');
  }
  return db;
}

// 全局错误处理 - 防止未捕获异常导致服务崩溃
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason?.message || reason);
});

const app = express();
const PORT = process.env.PORT || 3001;
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;

// 验证必要的环境变量
if (!API_AUTH_TOKEN) {
  console.error('❌ 缺少必要的环境变量: API_AUTH_TOKEN');
  console.error('请在 .env 文件中配置 API_AUTH_TOKEN');
  process.exit(1);
}

// 目录配置
const distDir = path.join(__dirname, 'dist');
const imagesDir = path.join(__dirname, 'images');
const publicDir = path.join(__dirname, 'public');

// 确保必要目录存在
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'ui'), { recursive: true });

// 支持的海报版本
const POSTER_VERSIONS = ['doctor', 'professor', 'qr-only'];

// 默认示例变量（仅用于文档展示）
const defaultVariables = {
  // 必填变量
  posterImage: 'https://example.com/poster-bg.jpg',
  qrCode: 'https://example.com/qr-link',
  subjectCategory: '材料\n科学',
  projectTitle: '新能源电池材料与技术',
  suitableMajor: '物理类 | 化学类',
  tutorBackground: '国内高校博士',
  // 可选变量（固定内容，有默认值）
  mainTitle: '1V1',
  researchBenefit: '专属导师推荐信',
  paperBenefit: '国际会议论文',
  projectLabel: '国内高校科研项目[1V1]',
  projectSubtitle: '远程线上科研 | 全年滚动招生',
  qrCaption: '扫码了解课题详情',
  tutorBackgroundLabel: '导师背景（博士版）/ 参考导师背景（教授版）',
  suitableMajorLabel: '适合专业'
};

// API 鉴权中间件（Bearer token 或 X-API-Key）
function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;
  const apiKey = req.headers['x-api-key'];
  
  if (bearerToken === API_AUTH_TOKEN || apiKey === API_AUTH_TOKEN) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    error: '未授权：请提供有效的API认证令牌',
    message: '请在请求头中添加 Authorization: Bearer <token> 或 X-API-Key: <token>'
  });
}

// 基础账号鉴权（用于 UI 控制台）
// 账户：zkyc 密码：Zkyc@565758
function basicAuthGuard(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Poster Render UI"');
    return res.status(401).send('Authentication required');
  }
  
  const creds = Buffer.from(auth.slice(6), 'base64').toString();
  const [user, pass] = creds.split(':');
  
  if (user === 'zkyc' && pass === 'Zkyc@565758') {
    return next();
  }
  
  res.set('WWW-Authenticate', 'Basic realm="Poster Render UI"');
  return res.status(401).send('Authentication required');
}

// 生成二维码 Data URL
async function buildQrDataUrl(qrText) {
  if (!qrText) return null;
  return qrcode.toDataURL(qrText, { 
    width: 500, 
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    type: 'image/png'
  });
}

// Playwright 渲染截图
async function renderPoster({ variables, posterVersion, filename, baseUrl }) {
  // 生成二维码（qrCode 字段总是被编码成二维码）
  const qrCodeDataUrl = variables.qrCode 
    ? await buildQrDataUrl(variables.qrCode) 
    : null;
  
  // 准备注入的变量
  const renderVariables = {
    ...variables,
    posterVersion,
    qrCodeDataUrl
  };
  
  // 检查构建产物是否存在
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('构建产物不存在，请先运行 npm run build');
  }
  
  // 读取并修改 HTML，注入变量
  let htmlContent = await fsp.readFile(indexPath, 'utf-8');
  
  // 在 </head> 前注入变量脚本和 Google Fonts
  const injectedCode = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      /* 全局字体设置 */
      *, *::before, *::after {
        font-family: 'Inter', 'Noto Sans SC', 'Noto Sans JP', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      }
    </style>
    <script>window.RENDER_VARIABLES = ${JSON.stringify(renderVariables)};</script>
  `;
  htmlContent = htmlContent.replace('</head>', injectedCode + '</head>');
  
  // 修复相对路径为绝对路径
  htmlContent = htmlContent.replace(/href="\.\/assets\//g, `href="${baseUrl}/preview/assets/`);
  htmlContent = htmlContent.replace(/src="\.\/assets\//g, `src="${baseUrl}/preview/assets/`);
  
  // 启动浏览器
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  try {
    // 通过 setContent 加载修改后的 HTML
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // 等待 React 渲染完成
    await page.waitForFunction(() => {
      return document.getElementById('poster-container') !== null;
    }, { timeout: 10000 });
    
    // 等待字体加载
    try {
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(2000); // 给字体更多渲染时间
    } catch (e) {
      console.log('字体等待警告:', e.message);
    }
    
    // 截图
    const outputPath = path.join(imagesDir, `${filename}.png`);
    
    const posterElement = await page.$('#poster-container');
    if (posterElement) {
      await posterElement.screenshot({
        path: outputPath,
        type: 'png'
      });
    } else {
      // 降级：全页面截图
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1080, height: 1920 }
      });
    }
    
    return outputPath;
  } finally {
    await browser.close();
  }
}

// 中间件配置
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件：图片公开访问
app.use('/images', express.static(imagesDir));

// 静态文件：构建产物（用于预览）
app.use('/preview', express.static(distDir));

// API 路由鉴权
app.use('/api', authGuard);

// 渲染 API
app.post('/api/render', async (req, res) => {
  try {
    const { filename, posterVersion, variables = {} } = req.body;
    
    // 验证必填字段
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段 filename（不含后缀）'
      });
    }
    
    if (!posterVersion || !POSTER_VERSIONS.includes(posterVersion)) {
      return res.status(400).json({
        success: false,
        error: `缺少必填字段 posterVersion，可选值: ${POSTER_VERSIONS.join(', ')}`
      });
    }
    
    if (!variables || typeof variables !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'variables 必须是对象'
      });
    }
    
    // 清理文件名
    const filenameSafe = filename.replace(/\.png$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    
    console.log('📝 开始渲染请求:', {
      filename: filenameSafe,
      posterVersion,
      variableKeys: Object.keys(variables)
    });
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    let filePath;
    
    // 只加入二维码模式：使用博士版模板，但只渲染二维码
    if (posterVersion === 'qr-only') {
      if (!variables.qrCode || !variables.posterImage) {
        return res.status(400).json({
          success: false,
          error: '只加入二维码模式需要提供 qrCode 和 posterImage 参数'
        });
      }
      
      // 使用博士版模板，但只传递必要的变量
      const qrOnlyVariables = {
        posterImage: variables.posterImage,
        qrCode: variables.qrCode
      };
      
      filePath = await renderPoster({
        variables: qrOnlyVariables,
        posterVersion: 'doctor', // 使用博士版模板
        filename: filenameSafe,
        baseUrl
      });
    } else {
      // 正常海报渲染模式
      filePath = await renderPoster({
        variables,
        posterVersion,
        filename: filenameSafe,
        baseUrl
      });
    }
    
    const imageUrl = `${baseUrl}/images/${filenameSafe}.png`;
    
    console.log('✅ 渲染完成:', imageUrl);
    
    return res.json({
      success: true,
      message: '渲染完成',
      data: {
        fileName: `${filenameSafe}.png`,
        filePath,
        imageUrl,
        posterVersion
      }
    });
  } catch (error) {
    console.error('❌ 渲染失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '渲染失败'
    });
  }
});

// 变量说明 API
app.get('/api/variables', (req, res) => {
  res.json({
    success: true,
    data: {
      posterVersions: POSTER_VERSIONS,
      variables: defaultVariables,
      requiredFields: ['filename', 'posterVersion'],
      requiredVariables: ['posterImage', 'qrCode', 'subjectCategory', 'projectTitle', 'suitableMajor', 'tutorBackground'],
      optionalVariables: ['mainTitle', 'researchBenefit', 'paperBenefit', 'projectLabel', 'projectSubtitle', 'qrCaption', 'tutorBackgroundLabel', 'suitableMajorLabel']
    },
    description: '可用变量列表及默认值示例。posterVersion 和 filename 为必填。'
  });
});

// 健康检查（无需鉴权）
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '海报渲染服务运行正常',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    supportedVersions: POSTER_VERSIONS,
    buildExists: fs.existsSync(path.join(distDir, 'index.html'))
  });
});

// 根路径重定向到UI控制台
app.get('/', (req, res) => {
  res.redirect('/ui');
});

// UI 控制台 - 基础账号鉴权
app.use('/ui', basicAuthGuard, express.static(path.join(publicDir, 'ui')));

// UI 渲染接口（走基础账号鉴权）
app.post('/ui/render', basicAuthGuard, async (req, res) => {
  try {
    const { filename, posterVersion, variables = {} } = req.body;
    
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段 filename（不含后缀）'
      });
    }
    
    if (!posterVersion || !POSTER_VERSIONS.includes(posterVersion)) {
      return res.status(400).json({
        success: false,
        error: `缺少必填字段 posterVersion，可选值: ${POSTER_VERSIONS.join(', ')}`
      });
    }
    
    const filenameSafe = filename.replace(/\.png$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    console.log('📝 UI 渲染请求:', {
      filename: filenameSafe,
      posterVersion,
      variableKeys: Object.keys(variables)
    });
    
    let filePath;
    
    // 只加入二维码模式：使用博士版模板，但只渲染二维码
    if (posterVersion === 'qr-only') {
      if (!variables.qrCode || !variables.posterImage) {
        return res.status(400).json({
          success: false,
          error: '只加入二维码模式需要提供 qrCode 和 posterImage 参数'
        });
      }
      
      // 使用博士版模板，但只传递必要的变量
      const qrOnlyVariables = {
        posterImage: variables.posterImage,
        qrCode: variables.qrCode,
        // 其他变量设为空字符串，不使用默认值
        subjectCategory: '',
        projectTitle: '',
        suitableMajor: '',
        tutorBackground: '',
        mainTitle: '',
        researchBenefit: '',
        paperBenefit: '',
        projectLabel: '',
        projectSubtitle: '',
        qrCaption: '',
        tutorBackgroundLabel: '',
        suitableMajorLabel: ''
      };
      
      filePath = await renderPoster({
        variables: qrOnlyVariables,
        posterVersion: 'doctor', // 使用博士版模板
        filename: filenameSafe,
        baseUrl
      });
    } else {
      // 正常海报渲染模式
      filePath = await renderPoster({
        variables,
        posterVersion,
        filename: filenameSafe,
        baseUrl
      });
    }
    
    const imageUrl = `${baseUrl}/images/${filenameSafe}.png`;
    
    return res.json({
      success: true,
      message: '渲染完成',
      data: {
        fileName: `${filenameSafe}.png`,
        filePath,
        imageUrl,
        posterVersion
      }
    });
  } catch (error) {
    console.error('❌ API 渲染失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '渲染失败'
    });
  }
});

// ========== 数据库接口（需要API鉴权）==========

// 数据库健康检查
app.get('/api/db/health', async (req, res) => {
  try {
    const { testConnection, dbConfig } = getDb();
    const result = await testConnection();
    res.json({
      success: result.success,
      message: result.success ? '数据库连接正常' : '数据库连接失败',
      database: dbConfig.database,
      host: dbConfig.host,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取数据库表列表
app.get('/api/db/tables', async (req, res) => {
  try {
    const { query, dbConfig } = getDb();
    const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name`;
    const result = await query(sql, [dbConfig.database]);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: result.data.map(t => t.table_name),
      count: result.data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取指定表的列信息
app.get('/api/db/columns/:tableName', async (req, res) => {
  try {
    const { query, dbConfig } = getDb();
    const { tableName } = req.params;
    const sql = `SELECT column_name, data_type, is_nullable, column_default, column_type FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position`;
    const result = await query(sql, [dbConfig.database, tableName]);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      table: tableName,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取指定表的数据（限制10条）
app.get('/api/db/data/:tableName', async (req, res) => {
  try {
    const { query } = getDb();
    const { tableName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const sql = `SELECT * FROM ${tableName} LIMIT ?`;
    const result = await query(sql, [limit]);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      table: tableName,
      count: result.data.length,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 执行SQL查询（谨慎使用）
app.post('/api/db/query', async (req, res) => {
  try {
    const { query: dbQuery } = getDb();
    const { sql, params = [] } = req.body;
    if (!sql) {
      return res.status(400).json({
        success: false,
        error: '缺少SQL语句'
      });
    }
    const result = await dbQuery(sql, params);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      count: result.data.length,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '未找到请求的资源'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('\n🚀 海报渲染服务 v2.0 已启动');
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🎨 支持版式: ${POSTER_VERSIONS.join(', ')}`);
  console.log(`🔐 API 鉴权: Authorization Bearer 或 X-API-Key 头`);
  console.log(`🔐 UI 鉴权: 浏览器登录 (账户: zkyc, 密码: Zkyc@565758)`);
  console.log(`📁 构建状态: ${fs.existsSync(path.join(distDir, 'index.html')) ? '✅ 已构建' : '⚠️  需要运行 npm run build'}`);
  console.log('\n📋 可用API:');
  console.log('   - GET  /health              - 健康检查（无需鉴权）');
  console.log('   - GET  /api/variables       - 获取支持的变量列表（需要API鉴权）');
  console.log('   - POST /api/render          - 执行渲染（需要API鉴权）');
  console.log('   - GET  /api/db/health       - 数据库连接检查（需要API鉴权）');
  console.log('   - GET  /api/db/tables       - 获取数据库表列表（需要API鉴权）');
  console.log('   - GET  /api/db/columns/:tableName - 获取表列信息（需要API鉴权）');
  console.log('   - GET  /api/db/data/:tableName    - 获取表数据（需要API鉴权）');
  console.log('   - POST /api/db/query        - 执行SQL查询（需要API鉴权）');
  console.log('   - GET  /ui                  - UI控制台（浏览器登录）');
  console.log('   - GET  /images/:filename    - 获取生成的图片（公开访问）');
  console.log('\n📝 渲染API请求示例:');
  console.log(`   curl -X POST http://localhost:${PORT}/api/render \\`);
  console.log('     -H "X-API-Key: YOUR_API_TOKEN" \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"filename":"test_poster","posterVersion":"doctor","variables":{"projectTitle":"研究课题","posterImage":"https://...","qrCode":"https://..."}}\'');
  console.log('\n✅ 服务启动成功，等待请求...\n');
});

