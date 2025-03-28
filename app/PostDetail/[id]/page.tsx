'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getPostDetail } from "@/app/api/Posts/router"
import Link from 'next/link'
import { Container, Card, Text, Button, Group, Stack, Avatar, Paper, Divider, Modal, TextInput, Textarea } from '@mantine/core'
import { formatDistanceToNow } from 'date-fns'

export default function PostDetailPage() {
    const [post, setPost] = useState<any>(null)
    const [dialogOpened, setDialogOpened] = useState(false)
    const [comment, setComment] = useState("Hello")
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const { data, status } = await getPostDetail(Number(id))
                if (status === 200 && data) {
                    setPost(data)
                } else {
                    console.log('⚠️ Failed to fetch post details, status code:', status)
                }
            } catch (error) {
                console.error('❌ Request error:', error)
            }
        }

        fetchPostDetail()
    }, [id]) // Listening to changes of id

    if (!post) {
        return <div>Loading...</div> // May be continuously triggered, check id and API response
    }
    console.log("🔍 Current post data: ", post);

    {
        post.images && console.log("🔍 Image list: ", post.images)
    }
    {
        post.images?.length > 0 && console.log("✅ Number of images: ", post.images.length)
    }

    const handleCommentSubmit = async (event) => {
        event.preventDefault()
        // Use URLSearchParams to encode the data in x-www-form-urlencoded format
        const payload = new URLSearchParams({
            target_id: post.id,
            comment: comment,
        })

        try {
            const response = await fetch("/backend/post/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload.toString()
            })

            if (response.ok) {
                alert("Comment submitted successfully.")
                setDialogOpened(false)
            } else {
                alert("Failed to submit comment, status code: " + response.status)
            }
        } catch (error) {
            console.error("Error submitting comment:", error)
            alert("Error submitting comment.")
        }
    }

    return (
        <Container size="lg" mt="150">
            <Card shadow="sm" padding="lg">
                <Text align="center" weight={700} size="xl">{post.title}</Text>
                <Text align="center" size="sm" color="dimmed">
                    Created {formatDistanceToNow(new Date(post.created_at))} ago
                </Text>

                <Paper padding="lg" mt="md" shadow="xs">
                    <Text size="md">{post.content || 'No content available'}</Text>
                </Paper>

                {post.images?.length > 0 && (
                    <Group spacing="sm" mt="md">
                        {post.images.map((image: { url: string }, index: number) => {
                            console.log(`🖼️ Image ${index} URL: `, image.url);
                            return (
                                <Card key={index} shadow="xs" padding="xs" radius="md" style={{ maxWidth: '100%' }}>
                                    <img src={image.url} alt={`Post Image ${index}`}
                                         style={{ width: '100%', height: 'auto' }}/>
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
                                <Text size="sm" color="dimmed" ml="md">
                                    {formatDistanceToNow(new Date(comment.created_at))} ago
                                </Text>
                            </Group>
                            <Text mt="xs">{comment.content}</Text>
                            <Link href={`/backend/post/comment/${comment.id}`}>
                                extend
                            </Link>
                        </Card>
                    ))}
                </Stack>

                <Group position="apart" mt="md">
                    <Button variant="outline" color="blue">Like {post.liked_by.length}</Button>
                    <Button variant="outline" color="teal">Favorite {post.favorited_by.length}</Button>
                </Group>

                {/* Comment dialog section */}
                <Group position="center" mt="md">
                    <Button onClick={() => setDialogOpened(true)}>Post Comment</Button>
                </Group>
                <Modal opened={dialogOpened} onClose={() => setDialogOpened(false)} title="Post Comment">
                    <form onSubmit={handleCommentSubmit}>
                        <TextInput
                            label="Target Post ID"
                            type="number"
                            value={post.id}
                            disabled
                            required
                        />
                        <Textarea
                            label="Comment Content"
                            value={comment}
                            onChange={(event) => setComment(event.currentTarget.value)}
                            required
                        />
                        <Group position="apart" mt="md">
                            <Button variant="outline" onClick={() => setDialogOpened(false)}>Cancel</Button>
                            <Button type="submit">Submit Comment</Button>
                        </Group>
                    </form>
                </Modal>
            </Card>
        </Container>
    )
}