import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 解析请求体，提取 chineseName 和 url
    const { chineseName, url } = await request.json();

    // 检查是否提供了 chineseName 和 url
    if (!chineseName || !url) {
      return NextResponse.json({ error: '请求体中缺少 chineseName 或 url' }, { status: 400 });
    }
    const fileName = `${chineseName}.pdf`;
    // 执行数据库更新操作
    await sql`
            UPDATE file
            SET url = ${url}
            WHERE chinesename = ${fileName};
        `;

    // 返回成功响应
    return NextResponse.json({ message: 'URL 更新成功' });
  } catch (error) {
    return NextResponse.json({ error: '无法更新数据库中的 URL' }, { status: 500 });
  }
}
