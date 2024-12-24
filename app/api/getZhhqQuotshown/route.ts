import {NextResponse} from 'next/server';
import replaceDomain from "@/app/api/getZhhqQuotshown/replaceDomain";

export async function GET(req: Request) {
    try {

        const targetUrl = "https://www.cneeex.com/zhhq/quotshown.html"

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
        const replacedData = replaceDomain(data)
        return new NextResponse(replacedData, {status: response.status});

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({error: "代理请求失败", details: error.message}, {status: 500});
    }
}