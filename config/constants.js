/**
 * 常量配置模块
 * 包含服务配置、支持的海报版本、默认变量等
 */

const path = require('path');

// 服务器配置
const PORT = process.env.PORT || 3001;
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;

// 目录配置
const distDir = path.join(__dirname, '../dist');
const imagesDir = path.join(__dirname, '../images');
const publicDir = path.join(__dirname, '../public');

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

// API 文档配置
const apiDocumentation = {
  version: '2.0.0',
  endpoints: [
    { method: 'GET', path: '/health', description: '健康检查（无需鉴权）' },
    { method: 'GET', path: '/api/variables', description: '获取支持的变量列表（需要API鉴权）' },
    { method: 'POST', path: '/api/render', description: '执行渲染（需要API鉴权）' },
    { method: 'GET', path: '/api/db/health', description: '数据库连接检查（需要API鉴权）' },
    { method: 'GET', path: '/api/db/tables', description: '获取数据库表列表（需要API鉴权）' },
    { method: 'GET', path: '/api/db/columns/:tableName', description: '获取表列信息（需要API鉴权）' },
    { method: 'GET', path: '/api/db/data/:tableName', description: '获取表数据（需要API鉴权）' },
    { method: 'POST', path: '/api/db/query', description: '执行SQL查询（需要API鉴权）' },
    { method: 'GET', path: '/ui', description: 'UI控制台（浏览器登录）' },
    { method: 'GET', path: '/images/:filename', description: '获取生成的图片（公开访问）' }
  ]
};

module.exports = {
  PORT,
  API_AUTH_TOKEN,
  distDir,
  imagesDir,
  publicDir,
  POSTER_VERSIONS,
  defaultVariables,
  apiDocumentation
};
