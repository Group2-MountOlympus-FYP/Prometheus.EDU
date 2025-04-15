export async function getMyCourses() {
  const url = `/backend/course/my_course`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response;
}

export async function checkEnrollmentStatus(course_id: number): Promise<boolean> {
  try {
    const response = await getMyCourses();
    const myCourses = await response.json();

    console.log("已报名课程 ID：", myCourses.map((c: any) => c.course?.id));
    console.log("当前课程 ID：", course_id);

    return myCourses.some((item: any) => Number(item.course?.id) === Number(course_id));
  } catch (error) {
    console.error("获取已报名课程失败", error);
    return false;
  }
}



