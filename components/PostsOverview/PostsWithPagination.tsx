'use client'
import { PostsOverview } from "./PostsOverview"
import { Pagination } from "@mantine/core"
import { useState, useEffect } from "react"
import { getPostsById } from "@/app/api/Course/router"
import style from './Posts.module.css'

interface postsPaginationProps{
    lecture_id?:number
}
interface PostInResponse{
    id: number;
    created_at: string;
    title: string;
    author_id: number;
    author_name: string;
    author_avatar_path: string;
    comments: object[];
}
interface Post{
    postId: number;
    publishDate: string;
    title: string;
    authorId: number;
    author: string;
    avatarPath: string;
    replyNum: number;
}

export function PostsWithPagination(props:postsPaginationProps){
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [posts, setPosts] = useState<Post[]>([])
    const postsData = [
        {
            title: 'This is first post of this website',
            publishDate: '2025-3-26 11:04',
            replyNum: 27,
            postId: 1,
            author: 'Bollix',
            authorId: 1,
            avatarPath: ''
        },
        {
            title: 'This is second post of this website',
            publishDate: '2025-3-26 11:06',
            replyNum: 0,
            postId: 2,
            author: 'Merlla',
            authorId: 2,
            avatarPath: ''
        }
    ]

    useEffect(() => {
        //访问接口
        const fetchPosts = async () => {
            try{
                if(props.lecture_id){
                    const response = await getPostsById(props.lecture_id,activePage,15)
                    if(response.ok){
                        const data = await response.json()
                        setTotalPages(data.total_page)
                        //将接收到的数据映射到数组中
                        //只保留需要的数据，剩下的数据全部丢弃
                        const extratedData = data.posts.map((post: PostInResponse) => ({
                            postId: post.id,
                            publishDate: post.created_at,
                            title: post.title,
                            authorId: post.author_id,
                            author: post.author_name,
                            avatarPath: post.author_avatar_path,
                            replyNum: post.comments.length
                        }))
                        //
                        console.log(extratedData)
                        //
                        setPosts(extratedData)
                    }else{
                        throw new Error("response is not ok!")
                    }
                }
                console.error("lecture id invalid!")
            }catch(error){
                console.error(`fetch posts error! ${error}`)
            }
        }
        
        fetchPosts()
    }, [])

    return (
        <div>
            {
                posts.map((post, key) => (
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
            <div className={style.pagination}>
                <Pagination total={totalPages} value={activePage} onChange={setActivePage}></Pagination>
            </div>
        </div>
    )
}