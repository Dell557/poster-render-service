const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  user: 'topic_new',
  password: 'zkyc@565758',
  database: 'topic_new',
  port: 3306,
  connectTimeout: 3000,
  socketTimeout: 5000
};

async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.connect();
    await connection.end();
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return { success: false, error: error.message };
  }
}

async function query(sql, params = []) {
  let connection = null;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.connect();
    const [rows, fields] = await connection.execute(sql, params);
    await connection.end();
    return { success: true, data: rows, error: null };
  } catch (error) {
    console.error('❌ 数据库查询错误:', error.message);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
    return { success: false, data: null, error: error.message };
  }
}

module.exports = {
  testConnection,
  query,
  dbConfig
};