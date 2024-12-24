import {NextResponse} from 'next/server';

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const targetUrl = searchParams.get("target");
        console.log(targetUrl);

        if (!targetUrl) {
            return NextResponse.json({error: "缺少 target 参数"}, {status: 400});
        }


        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                ...req.headers,
                host: new URL(targetUrl).host
            }
        });


        const data = await response.text();
        return new NextResponse(data, {status: response.status});

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({error: "代理请求失败", details: error.message}, {status: 500});
    }
}