/**
 * 渲染路由模块
 * 处理海报渲染相关的 API 请求
 */

const express = require('express');
const router = express.Router();
const { renderPoster } = require('../utils/renderer');
const { validateImageUrl } = require('../src/utils/urlValidator');
const { buildErrorResponse } = require('../utils/errorHandler');
const { POSTER_VERSIONS, defaultVariables } = require('../config/constants');

/**
 * POST /api/render - 执行渲染（需要API鉴权）
 */
router.post('/render', async (req, res) => {
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
    let renderVariables = variables;
    
    // 只加入二维码模式：使用博士版模板，但只渲染二维码
    if (posterVersion === 'qr-only') {
      if (!variables.qrCode || !variables.posterImage) {
        return res.status(400).json({
          success: false,
          error: '只加入二维码模式需要提供 qrCode 和 posterImage 参数'
        });
      }
      
      // 使用博士版模板，但只传递必要的变量
      renderVariables = {
        posterImage: variables.posterImage,
        qrCode: variables.qrCode
      };
    }
    
    // ===== 图片URL安全校验（在校验前先确定最终变量集）=====
    // 校验 posterImage（背景图URL）
    if (renderVariables.posterImage) {
      const posterImageResult = validateImageUrl(renderVariables.posterImage);
      if (!posterImageResult.valid) {
        return res.status(400).json({
          success: false,
          error: `海报背景图URL校验失败: ${posterImageResult.error}`
        });
      }
      // 使用转义后的URL防止XSS
      renderVariables.posterImage = posterImageResult.sanitizedUrl;
    }
    
    // ===== 图片URL安全校验结束 =====
    // 注意：qrCode 字段会被编码成二维码，不需要进行图片URL校验
    
    // 执行渲染
    filePath = await renderPoster({
      variables: renderVariables,
      posterVersion: posterVersion === 'qr-only' ? 'doctor' : posterVersion,
      filename: filenameSafe,
      baseUrl
    });
    
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
    const { statusCode, response } = buildErrorResponse(error);
    return res.status(statusCode).json(response);
  }
});

/**
 * GET /api/variables - 获取支持的变量列表
 */
router.get('/variables', (req, res) => {
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

module.exports = router;
