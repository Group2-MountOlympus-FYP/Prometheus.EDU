import { Fetch } from "@/app/api/General";

export async function getCourseByCategory(category: string) {
    const url = `/backend/course/all?category=${category}`;  // 正确路径拼接

    const response = await Fetch(url, {
        method: 'GET',
    });

    return response;
}

export async function getCourseByRecommend() {
  const url = `/backend/course/recommend`;

  const response = await Fetch(url, {
      method: 'GET',
  });

  return response;
}

export async function createCourse(data: FormData) {
  const url = '/backend/course/create'; // 你的后端创建课程的 API 地址

  const response = await Fetch(url, {
    method: 'POST',
    body: data,
  });

  return await response.json(); // 返回响应的 JSON 数据（课程ID等信息）
}

export async function getCourseDetailsById(id: number) {
  const url = `/backend/course/${id}`;

  const response = await Fetch(url, {
    method: 'GET',
  });

  return await response.json();
}

export async function searchCourses(query: string) {
  const url = `/backend/course/search?query=${encodeURIComponent(query)}`;

  const response = await Fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateCourseById(courseId: number, formData: FormData) {
  const url = `/backend/course/${courseId}/update`;
  return await Fetch(url, {
    method: 'PUT',
    body: formData,
  });
}