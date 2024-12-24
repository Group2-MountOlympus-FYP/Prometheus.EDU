import {NextResponse} from 'next/server';
import pool from "@/lib/db";

export async function GET(req: Request) {

    const targetUrl = "https://www.cneeex.com/zhhq/jsonData/prodinf.json";

    try {
        // 请求今天的数据
        const responseToday = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                ...req.headers,
                host: new URL(targetUrl).host
            }
        });

        // 请求昨天的数据
        // 从数据库中获取昨天的数据
        const {rows} = await pool.query(
            "SELECT data FROM daily_data WHERE date::date = CURRENT_DATE - INTERVAL '1 day'"
        );

        let dataYesterday;
        if (rows.length > 0) {
            dataYesterday = rows[0].data;
        } else {
            dataYesterday = {
                "currDate": "20241115",
                "currTime": "15:00",
                "lowLimit": "100.78",
                "highLimit": "15.13",
                "lastPrice": "1005.09"
            }; // 如果没有昨天的数据，可以设置为空或默认值
        }

        // 假设 API 返回 JSON 数据，需要同时处理两个请求的响应
        const dataToday = await responseToday.json();


        // 合并今天和昨天的数据返回
        const data = {
            today: dataToday,
            yesterday: dataYesterday
        };

        return NextResponse.json(data, {status: 200});

    } catch (error) {
        return NextResponse.json({error: "代理请求失败", details: error.message}, {status: 500});
    }
}