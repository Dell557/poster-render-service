/**
 * 鉴权中间件模块
 * 包含 API 鉴权和 UI 基础认证
 */

const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN;

/**
 * API 鉴权中间件（Bearer token 或 X-API-Key）
 */
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

/**
 * 基础账号鉴权（用于 UI 控制台）
 * 账户：zkyc 密码：Zkyc@565758
 */
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

module.exports = {
  authGuard,
  basicAuthGuard
};
