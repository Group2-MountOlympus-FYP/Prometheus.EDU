export async function getMyCourses() {
  const url = `/backend/course/my_course`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // 如果需要带 cookie
    headers: {
      // 不建议在 GET 中显式设置 Content-Type
    },
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  return await response.json(); // 返回数组，每个元素含有 course, progress 等字段
}
