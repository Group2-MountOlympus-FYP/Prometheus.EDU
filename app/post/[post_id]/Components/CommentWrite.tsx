'use client'

import {Button, Group, Dialog, Paper, Collapse} from "@mantine/core"
import { useRef, useState } from "react"
import classes from './CommentHtml.module.css';
import { CommentEditor } from "./CommentEditor"
import { RichTextEditorRef } from "@/components/WritingPost/WritingPostPanel"
import { notifications } from "@mantine/notifications"
import { getText } from "@/components/CookieConsent/language";

interface Props{
    post_id: number,
    opened: boolean;
    onClose: () => void;
    onSuccess: (c: any) => void;
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

                const newComment = await response.json();
                props.onSuccess?.(newComment);
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
    const handleClose = () => {
        close();
        props.onClose();
    };

    return (
        <>
            {/* 这里留一个 anchor，让页面流在折叠时占位 */}
            <Collapse in={props.opened}>
                <Paper
                    withBorder
                    shadow="md"
                    radius="md"
                    p="md"
                    mt="md"
                >
                    <CommentEditor ref={richText} />

                    <Group mt="md" justify="flex-end">
                        <Button variant="outline" onClick={handleClose} className={classes.commentEditCancel}>
                            {getText("cancel")}
                        </Button>
                        <Button onClick={handleCommentSubmit} className={classes.commentEditSubmit}>
                            {getText("submitComment")}
                        </Button>
                    </Group>
                </Paper>
            </Collapse>
        </>
    );

}