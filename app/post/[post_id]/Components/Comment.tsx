'use client'
import { Modal, Stack, Text, Group, Card, Avatar } from "@mantine/core"
import Link from "next/link"

interface Props{
    author_id: number
    created_at: string
    content: string
    id: number
}

export function Comment(props: Props){
    return (
            <Card shadow="xs" padding="sm" radius="md" withBorder>
                <Group wrap={"nowrap"}>
                    <Avatar size="sm" src={`/api/user/avatar/${props.author_id}`}/>
                    <Text size="sm" color="dimmed" ml="md">
                        {props.created_at} ago
                    </Text>
                </Group>
                <Text mt="xs">{props.content}</Text>
                <Link href={`/backend/post/comment/${props.id}`}>
                    extend
                </Link>
            </Card>
    )
}