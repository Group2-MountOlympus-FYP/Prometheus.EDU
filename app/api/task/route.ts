import pool from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    const targetUrl = 'https://www.cneeex.com/zhhq/jsonData/prodinf.json';

    try {
        // 获取数据
        const response = await fetch(targetUrl);
        const data = await response.json();

        // 将数据存储到数据库
        await pool.query('INSERT INTO daily_data (data, date) VALUES ($1, NOW())', [data]);

        return new NextResponse('数据已成功获取并存储');
    } catch (error) {
        return NextResponse.json({error: "代理请求失败", details: error.message}, {status: 500});
    }
}