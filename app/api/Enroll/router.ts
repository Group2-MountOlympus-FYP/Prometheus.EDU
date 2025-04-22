import { Fetch } from "@/app/api/General";

export async function enrollCourseById(course_id: number) {
  const url = `/backend/course/${course_id}/enroll`;

  const response = await Fetch(url, {
    method: 'GET',
  });

  const result = await response.json();
  return result;
}

