// lib/db.js
import {Pool} from 'pg';

// 使用 DATABASE_URL 或其他环境变量来配置连接
const pool = new Pool({
    connectionString: process.env.NEXT_PUBLIC_POSTGRES_URL,
    // 其他选项，比如 ssl 支持，如果需要的话
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;