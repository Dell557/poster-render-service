const { getPool } = require('../config/db');

async function query(sql, params = []) {
  let connection;
  try {
    const pool = getPool();
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('数据库查询错误:', error.message);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (e) {
        console.error('释放连接失败:', e.message);
      }
    }
  }
}

async function getTables() {
  const sql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = ?
    ORDER BY table_name
  `;
  return query(sql, ['topic_new']);
}

async function getTableColumns(tableName) {
  const sql = `
    SELECT column_name, data_type, is_nullable, column_default, column_type
    FROM information_schema.columns 
    WHERE table_schema = ? AND table_name = ?
    ORDER BY ordinal_position
  `;
  return query(sql, ['topic_new', tableName]);
}

async function getTableData(tableName, limit = 10) {
  const sql = `SELECT * FROM ${tableName} LIMIT ?`;
  return query(sql, [limit]);
}

async function execute(sql, params = []) {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('数据库执行错误:', error.message);
    throw error;
  }
}

module.exports = {
  query,
  execute,
  getTables,
  getTableColumns,
  getTableData
};