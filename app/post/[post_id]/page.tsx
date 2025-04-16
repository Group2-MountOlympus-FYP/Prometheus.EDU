import { PostDetail } from "./Components/PostDetail"

export default async function page({ params }: { params: {post_id: string}}){
    const postParams = await params;

    return (
        <PostDetail post_id={parseInt(postParams.post_id)}/>
    )
}
