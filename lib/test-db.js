import pool from './db.js';

async function testConnection() {
    try {
        // 执行一个简单的查询测试连接是否正常
        const res = await pool.query('SELECT 1');
        console.log('数据库连接成功:', res.rows);
    } catch (error) {
        console.error('数据库连接失败:', error);
    } finally {
        // 关闭连接池
        await pool.end();
    }
}

testConnection();