'use client'
import { Button, Modal, Input } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef, useState } from "react"
import { publishPost } from "@/app/api/Posts/router"
interface WritingPostPanelProps {
    opened: boolean;
    onClose: () => void;
}

type RichTextEditorRef = {
    getText: () => string
}

export function WritingPostPanel({ opened, onClose }: WritingPostPanelProps){
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

        const content = richText?.current?.getText()
        console.log(richText?.current?.getText());
        
        const response = await publishPost('title', content?content:'', [''], [])
        if(response.ok){
            alert('post success!')
        }
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