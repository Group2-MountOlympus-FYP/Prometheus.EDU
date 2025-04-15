export async function getCourseByCategory(category: string) {
    const url = `/backend/course/${category}`;  // ✅ 正确路径拼接

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 如果需要带 cookie
    });

    if (!response.ok) {
        throw new Error(`failed: ${response.status}`);
    }

    return await response.json();
}
