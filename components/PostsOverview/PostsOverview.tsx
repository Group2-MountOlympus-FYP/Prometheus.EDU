'use client'

import { Paper, Text, Grid, Avatar } from "@mantine/core"
import style from './PostsOverview.module.css'

interface PostOverviewProps {
    title?: string,
    publishDate?: string,
    replyNum?: string,
    postId?: number,
    author?: string,
    authorId?: number,
    avatarPath?: string,
}

export function PostsOverview(props: PostOverviewProps){
    
    const toAtuhorProfile = () => {

    }

    return (
        <Grid>
            <Grid.Col span={0.5}>
                <Avatar src={props.avatarPath} className={style.avatar} onClick={toAtuhorProfile}></Avatar>
            </Grid.Col>
            <Grid.Col span={10.5}>
                <table>
                    <tbody>
                        <tr style={{height: "3vh"}}>
                            <td>
                                <Text onClick={toAtuhorProfile} className={style.authorName}>{props.author}Author</Text>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <Paper shadow="xs" withBorder p={10}>
                                <Text size="xl">{props.title}Title</Text>
                            </Paper>
                            <Text size="s" c={"gray"} style={{paddingRight:"1vw", textAlign:'right'}}>Date</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Grid.Col>
        </Grid>
    )
}