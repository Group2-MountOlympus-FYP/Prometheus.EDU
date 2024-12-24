'use client';

import React, {useEffect, useState} from 'react';
import {Card, Skeleton} from '@mantine/core';

export function ChartBox({postfix}: { postfix: string }) {
    const [htmlContent, setHtmlContent] = useState(null);

    useEffect(() => {
        // 定义异步函数获取 HTML 内容
        async function fetchHtmlContent() {
            try {
                // 请求 API 路由
                const response = await fetch('/api/proxy?target=https://www.cneeex.com/' + postfix);
                if (!response.ok) {
                    throw new Error('请求失败');
                }

                // 解析为 HTML 文本
                const html = await response.text();
                setHtmlContent(html); // 设置 HTML 内容
            } catch (error) {
                console.error("API 请求错误:", error);
            }
        }

        fetchHtmlContent(); // 调用 fetchHtmlContent 函数

    }, []);
    const height = '50rem'


    return (
        <Card style={{width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {htmlContent ? (
                <iframe
                    srcDoc={htmlContent}
                    style={{width: '80%', height: '400px', border: 'none', margin: "50px"}}
                    title="Embedded Chart"
                />
            ) : (
                <Skeleton radius="md"/>
            )}
        </Card>
    );
}