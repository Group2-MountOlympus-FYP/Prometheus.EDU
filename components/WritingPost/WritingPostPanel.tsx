'use client'
import { Button, Modal, Input } from "@mantine/core"
import { RichTextEditor } from "../RichTextEditor/RichTextEditor"
import { useRef, useState } from "react"
import { publishPost } from "@/app/api/Posts/router"
import { notifications } from "@mantine/notifications"
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


        let tags:number[] = []
        
        const response = await publishPost(postTitle, content?content:'', tags, lecture_id, mentionList)
        if(response.ok){
            notifications.show({
                message: 'Post release successful'
            })
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

export function WritingAssignmentPanel({ opened, onClose, lecture_id }: WritingPostPanelProps){
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
        tags = [4]
        
        const response = await publishPost(postTitle, content?content:'', tags, lecture_id, mentionList)
        if(response.ok){
            notifications.show({
                message: 'Assignment release successful'
            })
        }
    }

    return (
        <Modal opened={opened} onClose={onClose} title={"Create a Post"} size={'70%'} centered>
            <Input.Wrapper error={error} style={{marginBottom:'1rem'}}>
                <Input radius={"xl"} placeholder="Title" value={title} onChange={handleTitleChange}></Input>
            </Input.Wrapper>
            <RichTextEditor ref={richText} canMentionAthena={false}></RichTextEditor>
            <Button fullWidth radius={"xl"} onClick={handlePostSubmit}>Post</Button>
        </Modal>
    )
}