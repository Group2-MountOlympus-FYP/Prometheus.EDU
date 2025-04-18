'use client'
import { Button, Modal, Input } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef, useState } from "react"
import { publishPost } from "@/app/api/Posts/router"
interface WritingPostPanelProps {
    opened: boolean;
    onClose: () => void;
    lecture_id: number;
}

export type RichTextEditorRef = {
    getText: () => string
    getMentionList: () => any[]
}

export function WritingPostPanel({ opened, onClose, lecture_id }: WritingPostPanelProps){
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
        const postTitle = title
        const mentionList = richText?.current?.getMentionList()


        //console.log(richText?.current?.getText());
        //console.log(`is AI included? ${containsAthenaMention(content)}`)


        let tags:number[] = []
        if(containsAthenaMention(content)){
            tags = [1]
        }
        const response = await publishPost(postTitle, content?content:'', tags, lecture_id, mentionList)
        if(response.ok){
            alert('post success!')
        }
    }

    const containsAthenaMention = (htmlContent: string | undefined): boolean => {
        if(htmlContent){
            const mentionRegex = /<span[^>]*data-type="mention"[^>]*data-id="-1"[^>]*>/g
            return mentionRegex.test(htmlContent)
        }
        return false   
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