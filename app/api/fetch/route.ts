import {NextResponse} from 'next/server';
import pool from "@/lib/db";

export async function POST(request: Request) {
    try {
        const {tag, page, limit} = await request.json();
        console.log(tag, page, limit);
        // 检查 page 和 limit 是否为正整数
        if (typeof page !== 'number' || page < 1 || typeof limit !== 'number' || limit < 1) {
            return NextResponse.json({error: 'Invalid page or limit'}, {status: 400});
        }

        // 计算偏移量
        const offset = (page - 1) * limit;

        // 查询 file 表，按 id 顺序分页返回
        const {rows} = await pool.query(
            `
          SELECT 
            file.id, 
            file.description, 
            file.name, 
            file.chinesename,
            COALESCE(tags.tag_content, '其它') AS tag
          FROM 
            file
          LEFT JOIN 
            tags ON file.tag_id = tags.id
          WHERE 
            tags.address = $1
          ORDER BY 
            file.id
          LIMIT 
            $2
          OFFSET 
            $3;
          `,
            [tag, limit, offset]
        );

        // 返回查询结果
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: '无法查询数据库'}, {status: 500});
    }
}
