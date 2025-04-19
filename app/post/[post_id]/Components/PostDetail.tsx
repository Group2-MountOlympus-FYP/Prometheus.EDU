

import {Button, Container, Group, Modal, Stack, Text, Textarea, TextInput, Title} from "@mantine/core"
import { cookies } from 'next/headers';
import CommentWriteButton from "@/app/post/[post_id]/Components/CommentWriteButton";


interface Props{
    post_id: number
}

export async function PostDetail(props: Props){
    const cookie_temp= await cookies()
    const cookieHeader =  cookie_temp.toString();
    const url = `http://127.0.0.1:5000/post/${props.post_id}`;

    // 明确类型并赋初值
    let content: string = '';
    let title: string = '';
    let createTime: string = '';
    let comments: any[] = [];
    let post;

    let author,id;
    try {
        const response = await fetch(url, {
            method: 'GET', headers: {cookie: cookieHeader},
            cache: 'no-store',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const jsonData = await response.json();

        content = jsonData.content;
        title = jsonData.title;
        createTime = jsonData.created_at;
        comments = jsonData.children;
        author = jsonData.author;
        id = jsonData.id;
        post = jsonData;
        console.log(post);
    } catch (err) {
        console.error('获取文章失败:', err);
    }



    return (
        <Container>
            <Title ta="center" style={{color:'#777CB9', }}>{title}</Title>

            <CommentWriteButton post={post} />
        </Container>
    )
}