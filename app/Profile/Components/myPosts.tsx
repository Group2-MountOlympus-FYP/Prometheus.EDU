
import { PostsOverview } from "@/components/PostsOverview/PostsOverview"

interface Props {
    posts: any[]
}
export function MyPosts(props: Props){
    return (
        <div style={{margin:'auto', width:'80vw'}}>
            {
                props.posts.map((post:any, index:number) => (
                    <PostsOverview
                        key={post.id}
                        title={post.title}
                        publishDate={post.created_at}
                        replyNum={post.comments.length}
                        postId={post.id}
                        author={post.author.username}
                        authorId={post.author.id}
                        avatarPath={post.author.avatar}
                    ></PostsOverview>
                ))
            }
        </div>
    )
}