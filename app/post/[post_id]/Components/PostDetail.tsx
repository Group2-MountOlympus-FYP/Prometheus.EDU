'use client'

import { Button, Container, Group, Modal, Stack, Text, Textarea, TextInput } from "@mantine/core"
import { MainContent } from "./MainContent"
import { useEffect, useState } from "react"
import { Comment } from "./Comment"


interface Props{
    post_id: number
}
interface CommentProps{
    author: number,
    content: string,
    created_at: string,
    deleted: boolean,
    id: number,
    parent_target: number,
}
export function PostDetail(props: Props){

    const [dialogOpened, setDialogOpened] = useState(false)
    const [comment, setComment] = useState("enter")

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState('')
    const [comments, setComments] = useState<CommentProps[]>([])

    const handleCommentSubmit = async (event:any) => {
        event.preventDefault()
        // Use URLSearchParams to encode the data in x-www-form-urlencoded format
        const payload = new URLSearchParams({
            target_id: String(props.post_id),
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

    useEffect(() => {
        const url = `/backend/post/${props.post_id}`
        fetch(url, {
            method: 'GET',
        }).then((respond) => {
            if(respond.ok){
                return respond.json()
            }else{
                
            }
        }).then((jsonData) => {
            console.log(jsonData)
            setContent(jsonData.content)
            setTitle(jsonData.title)
            setCreateTime(jsonData.created_at)
            setComments(jsonData.comments)
            console.log(comments)
        })
    }, [])
    return (
        <Container>
            <MainContent postContent={content} postTitle={title} createTime={createTime}></MainContent>
            <Stack>
                <Text>Comments</Text>
                {comments.map((comment: any, index: number) => (
                    <Comment author_id={comment.author} created_at={comment.created_at} content={comment.content} id={comment.id} key={index}></Comment>
                ))}
            </Stack>

            {/* Comment dialog section */}
            <Group mt="md">
                <Button onClick={() => setDialogOpened(true)}>Post Comment</Button>
            </Group>
            <Modal opened={dialogOpened} onClose={() => setDialogOpened(false)} title="Post Comment">
                <form onSubmit={handleCommentSubmit}>
                    <TextInput
                        label="Target Post ID"
                        type="number"
                        value={props.post_id}
                        disabled
                        required
                    />
                    <Textarea
                        label="Comment Content"
                        value={comment}
                        onChange={(event) => setComment(event.currentTarget.value)}
                        required
                    />
                    <Group mt="md">
                        <Button variant="outline" onClick={() => setDialogOpened(false)}>Cancel</Button>
                        <Button type="submit">Submit Comment</Button>
                    </Group>
                </form>
            </Modal>
        </Container>
    )
}