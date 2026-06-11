/**
 * 数据库路由模块
 * 处理数据库相关的 API 请求
 */

const express = require('express');
const router = express.Router();

// 数据库配置（延迟加载，仅在需要时导入）
let db = null;
function getDb() {
  if (!db) {
    db = require('../config/db');
  }
  return db;
}

/**
 * GET /api/db/health - 数据库健康检查
 */
router.get('/health', async (req, res) => {
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

/**
 * GET /api/db/tables - 获取数据库表列表
 */
router.get('/tables', async (req, res) => {
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

/**
 * GET /api/db/columns/:tableName - 获取指定表的列信息
 */
router.get('/columns/:tableName', async (req, res) => {
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

/**
 * GET /api/db/data/:tableName - 获取指定表的数据（限制10条）
 */
router.get('/data/:tableName', async (req, res) => {
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

/**
 * POST /api/db/query - 执行SQL查询（谨慎使用）
 */
router.post('/query', async (req, res) => {
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

module.exports = router;
