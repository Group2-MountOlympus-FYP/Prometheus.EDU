import {NextResponse} from 'next/server';
import {Client} from 'undici';
import iconv from 'iconv-lite';
import zlib from 'zlib';
import replaceDomain from "./replaceDomain";

export async function GET(req: Request) {
    try {
        const targetUrl = "https://www.rockjhzl.com"


        // 限制允许的目标域名
        // const allowedDomains = ['www.cneeex.com'];
        const urlObj = new URL(targetUrl);
        // if (!allowedDomains.includes(urlObj.host)) {
        //     return NextResponse.json({error: '不允许的目标域名'}, {status: 403});
        // }
        const originalHeader = req.headers

        // 创建自定义客户端
        const client = new Client(`${urlObj.protocol}//${urlObj.host}`, {
            connect: {
                rejectUnauthorized: false,
            },
        });

        // 发起请求
        const {statusCode, headers, body} = await client.request({
            method: 'GET',
            path: urlObj.pathname + urlObj.search,
            headers: {
                ...Object.fromEntries(req.headers),
                host: urlObj.host,
            },
        });

        // 获取响应头中的 Content-Type 和 Content-Encoding
        const contentType = headers['content-type'] || '';
        const contentEncoding = headers['content-encoding'] || '';
        const charsetMatch = contentType.match(/charset=([^;]*)/i);
        const charset = charsetMatch ? charsetMatch[1].toUpperCase() : 'UTF-8';

        // 读取响应体为 Buffer
        const chunks = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        let decompressedBuffer = buffer;

        // 根据 Content-Encoding 进行解压缩
        if (contentEncoding.includes('gzip')) {
            decompressedBuffer = zlib.gunzipSync(buffer);
        } else if (contentEncoding.includes('deflate')) {
            decompressedBuffer = zlib.inflateSync(buffer);
        } else if (contentEncoding.includes('br')) {
            decompressedBuffer = zlib.brotliDecompressSync(buffer);
        }

        // 根据字符编码转换
        const data = iconv.decode(decompressedBuffer, charset);
        const domainReplacedHtml = replaceDomain(data)
        // 关闭客户端
        client.close();

        // 返回响应，保留原始的响应头
        return new NextResponse(domainReplacedHtml, {status: statusCode, headers: originalHeader});
    } catch (error: any) {
        console.error('代理请求失败：', error);
        return NextResponse.json(
            {error: '代理请求失败', details: error.message},
            {status: 500}
        );
    }
}