'use client'

import { Button, Container, Group, Modal, Stack, Text, Textarea, TextInput } from "@mantine/core"
import { MainContent } from "./MainContent"
import { useEffect, useState } from "react"
import { Comment } from "./Comment"
import { CommentWrite } from "./CommentWrite"
import { useDisclosure } from "@mantine/hooks"


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

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState('')
    const [comments, setComments] = useState<CommentProps[]>([])
    const [opened, {open, close}] = useDisclosure(false)


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
                <Button onClick={open}>Post Comment</Button>
            </Group>
            <CommentWrite opened={opened} onClose={close} post_id={props.post_id}></CommentWrite>
        </Container>
    )
}