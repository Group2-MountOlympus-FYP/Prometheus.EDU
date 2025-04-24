'use client'
import {Avatar, Badge, Button, Group, Paper, Text, TypographyStylesProvider} from '@mantine/core';
import classes from './CommentHtml.module.css';
import { formatDistanceToNow } from 'date-fns';
import {CommentWrite} from "@/app/post/[post_id]/Components/CommentWrite";
import {useDisclosure} from "@mantine/hooks";
import { getText } from "@/components/CookieConsent/language";
import {useEffect} from "react";

interface Props{
    author_id: any
    created_at: string
    content: string
    id: number
    onReplyAdded: any
}



export function Comment(props: Props) {
    const createdAgo = formatDistanceToNow(new Date(props.created_at), { addSuffix: true });
    const [opened, { toggle, close }] = useDisclosure(false);

    return (
            <>
            <Group style={{ display: "flex", alignItems: "center"}}>
                <Avatar
                    src={props.author_id.avatar}
                    radius="xl"
                />
                <div>
                    {
                        props.author_id.id === 134 ?
                            <Group>
                                <Text
                                    fw={900}
                                    variant="gradient"
                                    gradient={{ from: 'rgba(254, 111, 78, 1)', to: 'rgba(225, 218, 101, 1)', deg: 120 }}
                                >{props.author_id.username}</Text>
                                <Badge color={"#777CB9"}>AI Assistance</Badge>
                            </Group>
                            :
                            <Text fz="sm">{props.author_id.username}</Text>
                    }

                    <Text fz="xs" c="dimmed">
                        {getText("created")} {createdAgo}
                    </Text>
                </div>
                <Button onClick={toggle} className={classes.commentButton}>
                    {getText("comment")}
                </Button>
            </Group>
            <TypographyStylesProvider className={classes.body}>
                <div
                    className={classes.content}
                    dangerouslySetInnerHTML={{
                        __html:
                            props.content,
                    }}
                />
            </TypographyStylesProvider>


            <CommentWrite opened={opened} onClose={close} post_id={props.id} onSuccess={props.onReplyAdded} />
            </>
    );
}