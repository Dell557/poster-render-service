/**
 * UI 路由模块
 * 处理 UI 控制台相关的请求
 */

const express = require('express');
const router = express.Router();
const { renderPoster } = require('../utils/renderer');
const { buildErrorResponse } = require('../utils/errorHandler');
const { POSTER_VERSIONS } = require('../config/constants');

/**
 * POST /ui/render - UI 渲染接口（走基础账号鉴权）
 */
router.post('/render', async (req, res) => {
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
    const { statusCode, response } = buildErrorResponse(error);
    return res.status(statusCode).json(response);
  }
});

/**
 * GET /ui - UI 控制台首页
 */
router.get('/', (req, res) => {
  const path = require('path');
  const publicDir = path.join(__dirname, '../public');
  res.sendFile(path.join(publicDir, 'ui', 'index.html'));
});

module.exports = router;
