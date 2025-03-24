export async function getPostsById(id: number, page: number, per_page: number){

    const data = new URLSearchParams({
        lecture_id: id.toString(),
        page: page.toString(),
        per_page: per_page.toString()
    })

    const url = `/course/get_course_detail?${data.toString}`
    const response = await fetch(url, {
        credentials: 'same-origin',
        cache: 'default',
        method: 'GET',
        headers:{
            "Content-Type": "application/form-data",
        },
    })
    return response
}