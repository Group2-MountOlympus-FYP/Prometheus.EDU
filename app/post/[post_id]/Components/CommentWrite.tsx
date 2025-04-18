'use client'

import { Button, Group, Modal } from "@mantine/core"
import { useRef, useState } from "react"
import { CommentEditor } from "./CommentEditor"
import { RichTextEditorRef } from "@/components/WritingPost/WritingPostPanel"
import { notifications } from "@mantine/notifications"

interface Props{
    post_id: number,
    opened: boolean;
    onClose: () => void;
}

export function CommentWrite(props: Props){
    const [error, setError] = useState("")

    const richText = useRef<RichTextEditorRef>()

    const handleCommentSubmit = async (event:any) => {
        event.preventDefault()
        // Use URLSearchParams to encode the data in x-www-form-urlencoded format
        if(!richText?.current?.getText()){
            setError("Comment can't be empty")
            return
        }
        setError("")

        const mentionList = richText?.current?.getMentionList()
        const payload = new URLSearchParams({
            target_id: String(props.post_id),
            comment: richText?.current?.getText(),
            mention_list: mentionList.toString(),
        })

        //console.log(payload.toString())
        //return

        try {
            const response = await fetch("/backend/post/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload.toString()
            })

            if (response.ok) {
                notifications.show({
                    title: 'Successful',
                    message: 'Comment submitted successfully.'
                })
                props.onClose()
            } else {
                notifications.show({
                    title: 'Error',
                    message: `Failed to submit comment, status code: ${response.status}`
                })
            }
        } catch (error) {
            console.error("Error submitting comment:", error)
            notifications.show({
                title: 'Error',
                message: 'Error submitting comment.'
            })
        }
    }

    return (
        <Modal opened={props.opened} onClose={props.onClose} title="Comment" centered>
            <CommentEditor ref={richText}></CommentEditor>
            <Group mt="md">
                <Button variant="outline" onClick={props.onClose}>Cancel</Button>
                <Button type="submit" onClick={handleCommentSubmit}>Submit Comment</Button>
            </Group>
        </Modal>
    )
}