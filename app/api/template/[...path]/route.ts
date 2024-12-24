// app/api/template/[...path]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {Client, Dispatcher} from 'undici';
import {Readable} from 'stream';

export async function GET(request: NextRequest, {
    params,
}: {
    params: Promise<{ path: string }>
}) {
    return handleRequest(request, {params});
}

export async function POST(request: NextRequest, {params}: { params: { path: string } }) {
    return handleRequest(request, params);
}

export async function PUT(request: NextRequest, {params}: { params: { path: string } }) {
    return handleRequest(request, params);
}

export async function DELETE(request: NextRequest, {params}: { params: { path: string } }) {
    return handleRequest(request, params);
}

export async function PATCH(request: NextRequest, {params}: { params: { path: string } }) {
    return handleRequest(request, params);
}

// 辅助函数：将 Node.js 的 Readable 流转换为 Web ReadableStream
function nodeStreamToWebStream(nodeStream) {
    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', (chunk) => {
                controller.enqueue(chunk);
            });
            nodeStream.on('end', () => {
                controller.close();
            });
            nodeStream.on('error', (err) => {
                controller.error(err);
            });
        },
        cancel(reason) {
            nodeStream.destroy(reason);
        },
    });
}


async function handleRequest(request: NextRequest, {
    params,
}: {
    params: Promise<{ path: string[] }>
}) {
    const dynamicPath = (await params).path;
    const realPath = dynamicPath.join('/')

    try {


        // 创建忽略 SSL 证书错误的客户端
        const client = new Client('https://www.rockjhzl.com', {
            connect: {
                rejectUnauthorized: false,
            },
        });


        // 发送请求到 '/template'
        let respond = client.request({
            path: '/template/' + realPath,
            method: request.method as Dispatcher.HttpMethod,
        });

        if (request.body) {
            respond.body = Readable.fromWeb(request.body);
        }

        const {statusCode, headers, body} = await respond
        console.log("After: ")
        console.log(statusCode)
        console.log('https://www.rockjhzl.com' + '/template/' + realPath)

        // 将 Node.js Readable 流转换为 Web ReadableStream
        const readableStream = nodeStreamToWebStream(body);

        // 转换头部信息为 NextResponse 可接受的格式
        const responseHeaders = new Headers();
        for (const [key, value] of Object.entries(headers)) {
            if (Array.isArray(value)) {
                for (const val of value) {
                    responseHeaders.append(key, val);
                }
            } else {
                if (typeof value === "string") {
                    responseHeaders.set(key, value);
                }
            }
        }

        // 关闭客户端以释放资源
        client.close();

        // 返回响应
        return new NextResponse(readableStream, {
            status: statusCode,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('代理请求失败：', error);
        return new NextResponse('代理请求失败', {status: 500});
    }
}