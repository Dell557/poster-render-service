/**
 * 错误处理工具模块
 * 实现双通道策略：用户通道（友好提示）+ 技术通道（详细日志）
 */

/**
 * 渲染错误分类枚举
 */
const RenderErrorType = {
  TIMEOUT: 'timeout',
  NETWORK: 'network',
  RENDER: 'render',
  VALIDATION: 'validation',
  SYSTEM: 'system'
};

/**
 * 渲染错误类 - 双通道策略实现
 * - 用户通道：友好的错误提示（用于UI展示，如Toast）
 * - 技术通道：详细的错误信息（用于日志和排查）
 */
class RenderError extends Error {
  constructor(type, userMessage, technicalDetails = {}) {
    super(userMessage);
    this.name = 'RenderError';
    this.type = type;
    this.userMessage = userMessage;
    this.technicalDetails = technicalDetails;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 错误分类器 - 根据原始错误判断错误类型
 */
function classifyError(error) {
  const message = error.message || '';
  
  // 超时错误
  if (message.includes('timeout') || message.includes('Timeout')) {
    return {
      type: RenderErrorType.TIMEOUT,
      userMessage: '海报渲染超时，请检查网络或稍后重试',
      technicalDetails: {
        originalMessage: message,
        suggestion: '增加超时时间或检查网络稳定性'
      }
    };
  }
  
  // 网络错误
  if (message.includes('net::') || 
      message.includes('network') || 
      message.includes('fetch') ||
      message.includes('Connection')) {
    return {
      type: RenderErrorType.NETWORK,
      userMessage: '网络请求失败，请检查网络连接',
      technicalDetails: {
        originalMessage: message,
        suggestion: '检查网络连接或尝试更换网络'
      }
    };
  }
  
  // 渲染/元素未找到错误
  if (message.includes('poster-container') ||
      message.includes('Cannot find') ||
      message.includes('element') ||
      message.includes('null') ||
      message.includes('undefined')) {
    return {
      type: RenderErrorType.RENDER,
      userMessage: '海报模板加载失败，请联系管理员',
      technicalDetails: {
        originalMessage: message,
        suggestion: '检查海报组件是否正确构建'
      }
    };
  }
  
  // 默认系统错误
  return {
    type: RenderErrorType.SYSTEM,
    userMessage: '渲染服务异常，请稍后重试',
    technicalDetails: {
      originalMessage: message,
      suggestion: '联系技术支持排查'
    }
  };
}

/**
 * 错误响应生成器
 */
function buildErrorResponse(error) {
  const isRenderError = error instanceof RenderError;
  const userMessage = isRenderError ? error.userMessage : (error.message || '渲染失败');
  const errorType = isRenderError ? error.type : 'unknown';
  const statusCode = isRenderError && error.type === RenderErrorType.VALIDATION ? 400 : 500;
  
  const response = {
    success: false,
    error: userMessage,
    errorType
  };
  
  // 开发环境返回技术详情
  if (process.env.NODE_ENV === 'development' && isRenderError) {
    response.technicalDetails = error.technicalDetails;
  }
  
  return { statusCode, response };
}

module.exports = {
  RenderErrorType,
  RenderError,
  classifyError,
  buildErrorResponse
};
