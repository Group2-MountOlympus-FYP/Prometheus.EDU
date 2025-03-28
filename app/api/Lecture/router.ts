export async function getLectureDetailsById(id: number, page: number, per_page: number) {
    const params = new URLSearchParams({
        lecture_id: id.toString(),
        page: page.toString(),
        per_page: per_page.toString()
    });

    const url = `/backend/course/get_lecture_detail?${params.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 如果需要带 cookie
        headers: {
            // "Content-Type" 不建议设置在 GET 请求里
        }
    });

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }

    return await response.json();
}
