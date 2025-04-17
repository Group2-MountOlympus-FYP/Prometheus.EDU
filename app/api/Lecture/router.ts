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
      throw new Error(`课程获取失败，状态码: ${response.status}`);
    }

    return await response.json();
}

export async function createLecture(course_id: number, formData: FormData) {
  const url = `/backend/course/${course_id}/add_lecture`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // 不要设置 headers 中的 Content-Type！
  });

  if (!response.ok) {
    throw new Error(`Lecture creation failed: ${response.status}`);
  }

  return await response.json();
}

