'use client'
import { Button, Modal, Input } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef, useState } from "react"


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

        //console.log(richText?.current?.getText());
        //console.log(`is AI included? ${containsAthenaMention(content)}`)


    }


    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <Input.Wrapper error={error} style={{marginBottom:'1rem'}}>
                <Input radius={"xl"} placeholder="Title" value={title} onChange={handleTitleChange}></Input>
            </Input.Wrapper>
            <RichTextEditor ref={richText}></RichTextEditor>
            <Button fullWidth radius={"xl"} onClick={handlePostSubmit}>Post</Button>
        </Modal>
    )
}