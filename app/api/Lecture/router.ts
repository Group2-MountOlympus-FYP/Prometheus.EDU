import { Fetch } from "@/app/api/General";

export async function getLectureDetailsById(id: number, page: number, per_page: number) {
    const params = new URLSearchParams({
        lecture_id: id.toString(),
        page: page.toString(),
        per_page: per_page.toString()
    });

    const url = `/backend/course/get_lecture_detail?${params.toString()}`;

    const response = await Fetch(url, {
        method: 'GET',
    });

    return await response.json();
}

export async function createLecture(course_id: number, formData: FormData) {
  const url = `/backend/course/${course_id}/add_lecture`;

  const response = await Fetch(url, {
    method: 'POST',
    body: formData,
  });

  return await response.json();
}

