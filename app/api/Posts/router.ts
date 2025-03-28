export async function publishPost(title: string, content: string, tags: string[], mentionList: number[]){
    const url = '/backend/post/publish'
    const formData = new URLSearchParams()
    const data = {
        title: title,
        content: content,
        
    }
    for (const [key, value] of Object.entries(data)){
        formData.append(key,value)
    }
    const response = await fetch(url, {
        method: 'POST',
        cache: 'default',
        credentials: 'same-origin',
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "*/*"
        },
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