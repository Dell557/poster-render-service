/**
 * 模块化重构测试脚本
 * 验证各模块是否正确导入和工作
 */

require('dotenv').config();

console.log('🔍 开始测试模块化重构...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   错误: ${error.message}`);
    failed++;
  }
}

// 测试配置模块
test('配置模块导入', () => {
  const constants = require('./config/constants');
  if (!constants.PORT || !constants.POSTER_VERSIONS) {
    throw new Error('配置模块缺少必要字段');
  }
});

// 测试中间件模块
test('中间件模块导入', () => {
  const { authGuard, basicAuthGuard } = require('./middleware/auth');
  if (typeof authGuard !== 'function' || typeof basicAuthGuard !== 'function') {
    throw new Error('中间件模块缺少必要函数');
  }
});

// 测试错误处理工具
test('错误处理工具导入', () => {
  const { RenderError, RenderErrorType, classifyError, buildErrorResponse } = require('./utils/errorHandler');
  if (typeof RenderError !== 'function' || !RenderErrorType || typeof classifyError !== 'function') {
    throw new Error('错误处理工具缺少必要组件');
  }
});

// 测试渲染工具
test('渲染工具导入', () => {
  const { renderPoster, buildQrDataUrl } = require('./utils/renderer');
  if (typeof renderPoster !== 'function' || typeof buildQrDataUrl !== 'function') {
    throw new Error('渲染工具缺少必要函数');
  }
});

// 测试路由模块
test('渲染路由导入', () => {
  const renderRoutes = require('./routes/renderRoutes');
  if (!renderRoutes || typeof renderRoutes !== 'function') {
    throw new Error('渲染路由模块无效');
  }
});

test('数据库路由导入', () => {
  const dbRoutes = require('./routes/dbRoutes');
  if (!dbRoutes || typeof dbRoutes !== 'function') {
    throw new Error('数据库路由模块无效');
  }
});

test('UI路由导入', () => {
  const uiRoutes = require('./routes/uiRoutes');
  if (!uiRoutes || typeof uiRoutes !== 'function') {
    throw new Error('UI路由模块无效');
  }
});

// 测试URL校验器
test('URL校验器导入', () => {
  const { validateImageUrl } = require('./src/utils/urlValidator');
  if (typeof validateImageUrl !== 'function') {
    throw new Error('URL校验器缺少必要函数');
  }
});

// 测试常量配置
test('POSTER_VERSIONS 常量', () => {
  const { POSTER_VERSIONS } = require('./config/constants');
  if (!POSTER_VERSIONS.includes('doctor') || !POSTER_VERSIONS.includes('professor') || !POSTER_VERSIONS.includes('qr-only')) {
    throw new Error('POSTER_VERSIONS 不完整');
  }
});

// 测试错误处理功能
test('RenderError 类功能', () => {
  const { RenderError, RenderErrorType } = require('./utils/errorHandler');
  const error = new RenderError(RenderErrorType.VALIDATION, '测试错误', { detail: '测试详情' });
  if (error.type !== RenderErrorType.VALIDATION || error.userMessage !== '测试错误') {
    throw new Error('RenderError 类功能异常');
  }
});

// 测试错误分类功能
test('classifyError 功能', () => {
  const { classifyError, RenderErrorType } = require('./utils/errorHandler');
  const timeoutError = new Error('timeout error');
  const result = classifyError(timeoutError);
  if (result.type !== RenderErrorType.TIMEOUT) {
    throw new Error('classifyError 分类异常');
  }
});

console.log('\n📊 测试结果:');
console.log(`   通过: ${passed}`);
console.log(`   失败: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 所有测试通过！模块化重构成功！');
} else {
  console.log('\n⚠️  部分测试失败，请检查代码');
  process.exit(1);
}
