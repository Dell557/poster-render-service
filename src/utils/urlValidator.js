/**
 * 图片URL校验工具（低风险实现）
 * - 不引入新依赖
 * - 使用Node.js原生API
 * - 单文件实现，即插即用
 */

// 1. URL格式校验正则（必须以http/https开头，图片扩展名结尾）
const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|png|gif|webp|svg)$/i;

// 2. 域名白名单（支持字符串精确匹配和正则表达式）
const DOMAIN_WHITELIST = [
  'deepsightfuturexdf.oss-cn-beijing.aliyuncs.com',
  /^.*\.aliyuncs\.com$/,
  /^.*\.qiniu\.com$/,
  /^.*\.qiniudn\.com$/,
  /^.*\.cos\.cloud\.tencent\.com$/,
  /^.*\.cos\.[a-z-]+\.myqcloud\.com$/,
  /^.*\.oss-cn-[a-z]+\.aliyuncs\.com$/
];

// 3. 内网地址黑名单（防SSRF攻击）
const INTERNAL_PATTERN = /^(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;

// 4. XSS特殊字符转义映射
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };

/**
 * 校验图片URL
 * @param {string} url - 待校验的URL
 * @returns {Object} { valid: boolean, error?: string, sanitizedUrl?: string }
 */
function validateImageUrl(url) {
  // 空值检查
  if (!url?.trim()) {
    return { valid: false, error: 'URL不能为空' };
  }

  const trimmedUrl = url.trim();

  // 格式校验：必须以http/https开头，图片扩展名结尾
  if (!URL_PATTERN.test(trimmedUrl)) {
    return { valid: false, error: 'URL格式无效（需以http/https开头，图片扩展名结尾）' };
  }

  try {
    const urlObj = new URL(trimmedUrl);
    const hostname = urlObj.hostname.toLowerCase();

    // 内网地址拦截（防SSRF）
    if (INTERNAL_PATTERN.test(hostname)) {
      return { valid: false, error: '禁止访问内网地址' };
    }

    // 域名白名单校验
    const isAllowed = DOMAIN_WHITELIST.some(pattern => {
      if (typeof pattern === 'string') {
        return hostname === pattern.toLowerCase();
      }
      return pattern.test(hostname);
    });

    if (!isAllowed) {
      return { valid: false, error: `域名 ${hostname} 不在允许列表中` };
    }

  } catch (e) {
    return { valid: false, error: 'URL解析失败' };
  }

  // 转义特殊字符，防止XSS攻击
  const sanitizedUrl = trimmedUrl.replace(/[&<>"']/g, char => ESCAPE_MAP[char] || char);
  
  return { valid: true, sanitizedUrl };
}

/**
 * 批量校验URL数组
 * @param {string[]} urls - URL数组
 * @returns {Object[]} 校验结果数组
 */
function validateImageUrls(urls) {
  return urls.map(url => ({
    url,
    ...validateImageUrl(url)
  }));
}

module.exports = {
  validateImageUrl,
  validateImageUrls,
  // 导出配置用于测试
  URL_PATTERN,
  DOMAIN_WHITELIST,
  INTERNAL_PATTERN
};
