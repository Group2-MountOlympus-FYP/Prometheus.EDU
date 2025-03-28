import { PostDetail } from "./Components/PostDetail"

export default function page({ params }: { params: {post_id: string}}){

    
    return (
        <PostDetail post_id={parseInt(params.post_id)}/>
    )
}