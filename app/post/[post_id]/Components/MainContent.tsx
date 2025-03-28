'use client'

import Mention from "@tiptap/extension-mention"
import StarterKit from "@tiptap/starter-kit"
import { Paper, Text } from "@mantine/core"

interface Props{
    postTitle: string
    postContent: string
    createTime: string
}

export function MainContent(props: Props){
    return (
        <div style={{marginTop:'10vh', marginLeft:'2vw', marginRight: '2vw'}}>
            
            <Text size="xl">{props.postTitle}</Text>
            <Text size="sm">
                Created {props.createTime} ago
            </Text>

            <Paper mt="md" shadow="xs">
                <div dangerouslySetInnerHTML={{__html: props.postContent}}></div>
            </Paper>
            
        </div>
    )
}