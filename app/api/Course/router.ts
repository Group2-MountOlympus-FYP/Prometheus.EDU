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

export async function createCourse(data: FormData) {
  const url = '/backend/course/create'; // 你的后端创建课程的 API 地址

  const response = await fetch(url, {
    method: 'POST',
    body: data,
    credentials: 'include', // 如果需要带上 cookie
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  return await response.json(); // 返回响应的 JSON 数据（课程ID等信息）
}