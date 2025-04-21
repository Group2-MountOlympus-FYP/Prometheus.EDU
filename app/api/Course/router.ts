import { Fetch } from "@/app/api/General";

export async function getCourseByCategory(category: string) {
    const url = `/backend/course/${category}`;  // 正确路径拼接

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
