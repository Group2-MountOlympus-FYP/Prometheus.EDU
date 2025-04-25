'use client'

import { Paper, Text, Grid, Avatar } from "@mantine/core"
import { useRouter } from "next/navigation"
import style from './Posts.module.css'

interface PostOverviewProps {
    title?: string,
    publishDate?: string,
    replyNum?: number,
    postId?: number,
    author?: string,
    authorId?: number,
    avatarPath?: string,
}

export function PostsOverview(props: PostOverviewProps){
    const router = useRouter()

    const toAtuhorProfile = () => {
        if(props.authorId){
            router.push(`/Profile/${props.authorId}`)
        }
    }

    const toPostDetail = () => {
        router.push(`/post/${props.postId}`)
    }

    return (
        <Grid>
            <Grid.Col span={0.75}>
                <Avatar src={props.avatarPath} className={style.avatar} onClick={toAtuhorProfile}></Avatar>
            </Grid.Col>
            <Grid.Col span={11.25}>
                <table>
                    <tbody>
                        <tr style={{height: "3vh"}}>
                            <td>
                                <Text onClick={toAtuhorProfile} className={style.authorName}>{props.author}</Text>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <Paper
                                shadow="xs"
                                withBorder
                                p={10}
                                className={`${style.paper} ${style.clickablePaper}`}
                                onClick={toPostDetail}
                            >
                                <Grid>
                                    <Grid.Col span={11}>
                                        <Text size="xl" className={style.title}>{props.title}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={1} className={style.replyBadgeGrid}>
                                        <div hidden={!props.replyNum}>
                                            <ReplyBadge replyNum={props.replyNum}></ReplyBadge>
                                        </div>
                                    </Grid.Col>
                                </Grid>
                            </Paper>
                            <Text size="s" c={"gray"} style={{paddingRight:"1vw", textAlign:'right'}}>{
                                props.publishDate ? 
                                new Date(props.publishDate).toLocaleString():
                                props.publishDate
                            }</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Grid.Col>
        </Grid>
    )
}

interface replyProps{
    replyNum?: number
}
const ReplyBadge = (props: replyProps) => {
    return (
        <div className={style.badge}>
            <span className={style.badgeText}>{props.replyNum}</span>
        </div>
    )
}