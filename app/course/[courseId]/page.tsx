import CourseDetail from '@/app/course/[courseId]/course_detail';

export default async function Page({ params }: { params: { courseId: string } }) {
  const courseParams = await params; // 虽然 await 实际没作用
  const courseId = parseInt(courseParams.courseId || '115', 10);

  return <CourseDetail courseId={courseId} />;
}
