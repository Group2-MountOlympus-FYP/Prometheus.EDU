'use client'

import {useState, useEffect} from "react"
import {useParams} from "next/navigation";
import {getPostDetail} from "@/app/api/Posts/router"
import {Container, Card, Text, Button, Group, Stack, Avatar, Paper, Divider} from '@mantine/core'
import {formatDistanceToNow} from 'date-fns'


export default function PostDetailPage() {
    const [post, setPost] = useState<any>(null)
    const params = useParams();
    const id = params?.id;

    useEffect(() => {

        const fetchPostDetail = async () => {
            try {
                const {data, status} = await getPostDetail(Number(id))
                if (status === 200 && data) {
                    setPost(data)
                } else {
                    console.log('⚠️ 获取帖子详情失败: 状态码', status)
                }
            } catch (error) {
                console.error('❌ 请求出错:', error)
            }
        }

        fetchPostDetail()
    }, [id]) // 监听 id 变化

    if (!post) {
        return <div>Loading...</div> // ✅ 这里可能一直触发，检查 id 和 API 返回
    }
    console.log("🔍 当前帖子数据: ", post);

    {
        post.images && console.log("🔍 图片列表: ", post.images)
    }
    {
        post.images?.length > 0 && console.log("✅ 图片数量: ", post.images.length)
    }

    return (
        <Container size="lg" mt="150">
            <Card shadow="sm" padding="lg">
                <Text align="center" weight={700} size="xl">{post.title}</Text>
                <Text align="center" size="sm"
                      color="dimmed">Created {formatDistanceToNow(new Date(post.created_at))} ago</Text>

                <Paper padding="lg" mt="md" shadow="xs">
                    <Text size="md">{post.content || 'No content available'}</Text>
                </Paper>

                {post.images?.length > 0 && (
                    <Group spacing="sm" mt="md">
                        {post.images.map((image: { url: string }, index: number) => {
                            console.log(`🖼️ 图片 ${index} URL: `, image.url);
                            return (
                                <Card key={index} shadow="xs" padding="xs" radius="md" style={{maxWidth: '100%'}}>
                                    <img src={image.url} alt={`Post Image ${index}`}
                                         style={{width: '100%', height: 'auto'}}/>
                                </Card>
                            );
                        })}
                    </Group>
                )}


                <Divider my="md"/>

                <Stack spacing="md">
                    <Text weight={500}>Comments</Text>
                    {post.comments.map((comment: any, index: number) => (
                        <Card key={index} shadow="xs" padding="sm" radius="md" withBorder>
                            <Group position="apart" wrap={false}>
                                <Avatar size="sm" src={`/api/user/avatar/${comment.author_id}`}/>
                                <Text size="sm" color="dimmed"
                                      ml="md">{formatDistanceToNow(new Date(comment.created_at))} ago</Text>
                            </Group>
                            <Text mt="xs">{comment.content}</Text>
                        </Card>
                    ))}
                </Stack>

                <Group position="apart" mt="md">
                    <Button variant="outline" color="blue">Like {post.liked_by.length}</Button>
                    <Button variant="outline" color="teal">Favorite {post.favorited_by.length}</Button>
                </Group>
            </Card>
        </Container>
    )
}
