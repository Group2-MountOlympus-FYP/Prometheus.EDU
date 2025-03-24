'use client'
import { Button, Modal } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef } from "react"
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

    const handlePostSubmit = async () => {
        const content = richText?.current?.getText()
        console.log(richText?.current?.getText());
        
        const response = await publishPost('title', content?content:'', [''], [])
    }

    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <RichTextEditor ref={richText}></RichTextEditor>
            <Button fullWidth radius={"xl"} onClick={handlePostSubmit}>Post</Button>
        </Modal>
    )
}