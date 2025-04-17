export async function publishPost(title: string, content: string, tags: number[], lecture_id: number){
    const url = '/backend/post/publish'
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)

    for(const tag of tags){
        formData.append("tags", tag.toString())
    }

    formData.append('lecture_id', String(lecture_id))

    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    const response = await fetch(url, {
        method: 'POST',
        cache: 'default',
        credentials: 'same-origin',
        body: formData,
    })
    return response
}

export async function uploadImage(){
    const url = '/backend/post/add_image'
    
    const response = await fetch(url, {
        method: 'POST',
        cache: 'default',
        credentials: 'same-origin',
        
    })
    return response
}

export async function getPostsByLectureId(lectureId: number, page:number, perPage:number){
    const data = new URLSearchParams({
        lecture_id: lectureId.toString(),
        page: page.toString(),
        per_page: perPage.toString(),
    })
    const url = `/backend/course/get_lecture_detail/${data.toString}`
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin'
    })
    return response
}

export async function getPostDetail(id: number) {
    const url = `/backend/post/${id}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin'
    });

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }

    const data = await response.json(); // ✅ 解析 JSON 数据
    return { data, status: response.status }; // ✅ 返回数据和状态码
}