/**
 * 海报渲染工具模块
 * 负责 Playwright 截图和 HTML 模板处理
 */

const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const qrcode = require('qrcode');
const { chromium } = require('playwright');
const { RenderError, RenderErrorType, classifyError } = require('./errorHandler');
const logger = require('./logger');

const distDir = path.join(__dirname, '../dist');
const imagesDir = path.join(__dirname, '../images');

/**
 * 生成二维码 Data URL
 */
async function buildQrDataUrl(qrText) {
  if (!qrText) return null;
  logger.debug('生成二维码', { length: qrText.length });
  return qrcode.toDataURL(qrText, { 
    width: 500, 
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    type: 'image/png'
  });
}

/**
 * Playwright 渲染截图（带完善错误处理）
 */
async function renderPoster({ variables, posterVersion, filename, baseUrl }) {
  let browser = null;
  let context = null;
  let page = null;
  
  logger.info('开始渲染海报', { posterVersion, filename });
  
  try {
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
      logger.error('构建产物不存在', { indexPath });
      throw new RenderError(
        RenderErrorType.VALIDATION,
        '系统配置异常，请联系管理员',
        { originalMessage: '构建产物不存在', suggestion: '运行 npm run build 构建项目' }
      );
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
    logger.debug('启动 Playwright 浏览器');
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none'
      ]
    });
    
    context = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true
    });
    
    page = await context.newPage();
    
    // 通过 setContent 加载修改后的 HTML
    logger.debug('加载页面内容');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // 等待 React 渲染完成
    logger.debug('等待 React 渲染');
    await page.waitForFunction(() => {
      return document.getElementById('poster-container') !== null;
    }, { timeout: 10000 });
    
    // 等待字体加载
    try {
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(2000);
      logger.debug('字体加载完成');
    } catch (e) {
      logger.warn('字体加载超时（非致命）', { error: e.message });
    }
    
    // 截图
    const outputPath = path.join(imagesDir, `${filename}.png`);
    logger.debug('开始截图', { outputPath });
    
    const posterElement = await page.$('#poster-container');
    if (posterElement) {
      await posterElement.screenshot({
        path: outputPath,
        type: 'png'
      });
    } else {
      // 降级：全页面截图
      logger.warn('未找到海报容器，使用全页面截图');
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1080, height: 1920 }
      });
    }
    
    logger.info('海报渲染成功', { posterVersion, filename, outputPath });
    return outputPath;
    
  } catch (error) {
    // 双通道策略：
    // 1. 用户通道：返回友好的错误提示
    // 2. 技术通道：记录详细日志用于排查
    
    // 如果已经是自定义错误，直接使用
    if (error instanceof RenderError) {
      logger.error('渲染失败', { 
        userMessage: error.userMessage,
        technicalDetails: error.technicalDetails,
        posterVersion,
        filename
      });
      throw error;
    }
    
    // 否则对原始错误进行分类处理
    const { type, userMessage, technicalDetails } = classifyError(error);
    
    logger.error('渲染失败', { 
      type,
      userMessage,
      technicalDetails: {
        ...technicalDetails,
        stack: error.stack,
        posterVersion,
        filename,
        variableKeys: Object.keys(variables)
      }
    });
    
    throw new RenderError(type, userMessage, technicalDetails);
    
  } finally {
    // 确保资源释放
    try {
      if (page) await page.close();
      if (context) await context.close();
      if (browser) await browser.close();
      logger.debug('Playwright 资源已释放');
    } catch (e) {
      logger.warn('资源释放警告', { error: e.message });
    }
  }
}

module.exports = {
  renderPoster,
  buildQrDataUrl
};