// ⚠️ 这个函数现在只能用于真正报名，不要用于判断状态！
export async function enrollCourseById(course_id: number) {
  const url = `/backend/course/${course_id}/enroll`;

  const response = await fetch(url, {
    method: 'GET', // ✅ 需要配合后端的 POST 方法，别用 GET
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error("报名失败");
    (error as any).status = response.status;
    throw error;
  }

  const result = await response.json();
  return result;
}

