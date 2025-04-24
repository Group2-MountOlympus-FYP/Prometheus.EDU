'use client'
import classes from './Posts.module.css';
import { PostsOverview } from "./PostsOverview"

interface Props{
    assignments: any
}

export function Assignments(props:Props){
    return (
        <div style={{width:'63vw'}}>
            {/* <div className={classes.assignmentImg}></div> */}
            {
                props.assignments.map((post: any, key: any) => (
                    post.tags.includes(4) ? 
                    <PostsOverview 
                        title={post.title} 
                        publishDate={post.created_at}
                        replyNum={post.children.lenght}
                        postId={post.id}
                        author={post.author.username}
                        authorId={post.author.id}
                        avatarPath={post.author.avatar}
                        key={post.id}
                    ></PostsOverview>
                    :   
                    <div key={post.id}></div>               
                ))
            }
        </div>
    )
}