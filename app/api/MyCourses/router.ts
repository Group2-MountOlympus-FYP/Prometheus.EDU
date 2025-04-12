export async function getMyCourses() {
  const url = `/backend/course/my_course`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response
}
