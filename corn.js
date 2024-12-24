// cron.js
const cron = require('node-cron');
const fetch = require('node-fetch');
const pool = require('@/lib/db'); // 根据您的项目结构调整路径

// 定义目标 URL
const targetUrl = 'https://www.cneeex.com/zhhq/jsonData/prodinf.json';

// 设置每天午夜执行的定时任务
cron.schedule('0 0 * * *', async () => {
    try {
        const response = await fetch(targetUrl);
        const data = await response.json();

        // 将数据存储到数据库，假设表名为 'daily_data'
        await pool.query('INSERT INTO daily_data (data, date) VALUES ($1, NOW())', [data]);

        console.log('数据已成功获取并存储');
    } catch (error) {
        console.error('获取数据时出错：', error);
    }
});