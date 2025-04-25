'use client'
import { Button, Modal, Input } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef, useState } from "react"
import { publishPost } from "@/app/api/Posts/router"
import { notifications } from "@mantine/notifications"
import classes from "./WritingPostPanel.module.css"
interface WritingPostPanelProps {
    opened: boolean;
    onClose: () => void;
    lecture_id: number;
    onSubmit: (data: {
        title: string;
        content: string;
        mentionList: any[];
    }) => void;
}

export type RichTextEditorRef = {
    getText: () => string
    getMentionList: () => any[]
}

export function WritingPostPanel({ opened, onClose, lecture_id, onSubmit }: WritingPostPanelProps){
    const richText = useRef<RichTextEditorRef | null>(null);
    const [title, setTitle] = useState("")
    const [error, setError] = useState("")

    const handleTitleChange = (e:any) => {
        setTitle(e.target.value)
        if(title){
            setError("")
        }
    }
    const handlePostSubmit = async () => {
        if(!title){
            setError("Title can not be empty!")
            return
        }

        const content = richText?.current?.getText() || "";
        const mentionList = richText?.current?.getMentionList() || [];

        onSubmit({ title, content, mentionList })

    }

    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <Input.Wrapper error={error} style={{marginBottom:'1rem'}}>
                <Input radius={"xl"} placeholder="Title" value={title} onChange={handleTitleChange} maxLength={50}></Input>
            </Input.Wrapper>
            <RichTextEditor ref={richText} canMentionAthena={true}></RichTextEditor>
            <Button fullWidth radius={"xl"} onClick={handlePostSubmit} style={{ backgroundColor: "#3C4077" }}>Post</Button>
        </Modal>
    )
}

export function WritingAssignmentPanel({ opened, onClose, lecture_id, onSubmit }: WritingPostPanelProps){
    const richText = useRef<RichTextEditorRef>()
    const [title, setTitle] = useState("")
    const [error, setError] = useState("")

    const handleTitleChange = (e:any) => {
        setTitle(e.target.value)
        if(title){
            setError("")
        }
    }
    const handlePostSubmit = async () => {
        if(!title){
            setError("Title can not be empty!")
            return
        }

        const content = richText.current?.getText() || ""
        const mentionList = richText.current?.getMentionList() || []

        onSubmit({ title, content, mentionList })

    }

    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <Input.Wrapper error={error} style={{marginBottom:'1rem'}}>
                <Input radius={"xl"} placeholder="Title" value={title} onChange={handleTitleChange}></Input>
            </Input.Wrapper>
            <RichTextEditor ref={richText} canMentionAthena={false}></RichTextEditor>
            <Button fullWidth radius={"xl"} onClick={handlePostSubmit} color={"#777CB9"}>Post</Button>
        </Modal>
    )
}