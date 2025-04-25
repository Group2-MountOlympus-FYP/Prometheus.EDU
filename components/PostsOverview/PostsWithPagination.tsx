'use client'
import { PostsOverview } from "./PostsOverview"
import { Pagination } from "@mantine/core"
import { useState, useEffect } from "react"
import { getLectureDetailsById } from "@/app/api/Lecture/router"
import style from './Posts.module.css'

interface postsPaginationProps{
    lecture_id?:number,
    lecture_data: any
}
interface Post{
    postId: number;
    publishDate: string;
    title: string;
    authorId: number;
    author: string;
    avatarPath: string;
    replyNum: number;
    tags:any[];
}

export function PostsWithPagination(props:postsPaginationProps){
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        //访问接口
        const extratedData = props.lecture_data.posts.map((post: any) => ({
            postId: post.id,
            publishDate: post.created_at,
            title: post.title,
            authorId: post.author.id,
            author: post.author.username,
            avatarPath: post.author.avatar,
            replyNum: post.children.length,
            tags: post.tags,
        }))

        setPosts(extratedData)
    }, [])

    return (
        <div style={{width:'90%'}}>
            {
                posts.map((post, key) => (
                    post.tags.includes(4) ? 
                    <span key={post.postId}></span>
                    :
                    <PostsOverview 
                        title={post.title} 
                        publishDate={post.publishDate}
                        replyNum={post.replyNum}
                        postId={post.postId}
                        author={post.author}
                        authorId={post.authorId}
                        avatarPath={post.avatarPath}
                        key={post.postId}
                    ></PostsOverview>
                ))
            }
            
        </div>
    )
}