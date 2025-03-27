export async function getCourseDetailsById(id: number) {
    const url = `/backend/course/${id}`;  // ✅ 正确路径拼接

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 如果需要带 cookie
    });

    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }

    return await response.json();
}
