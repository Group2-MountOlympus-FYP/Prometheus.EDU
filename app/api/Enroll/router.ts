export async function enrollCourseById(course_id: number) {
  const url = `/backend/course/${course_id}/enroll`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // 如果需要带 cookie
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const result = await response.json();

  // 为了统一返回结构，直接返回 course 对象
  return result.course;
}
