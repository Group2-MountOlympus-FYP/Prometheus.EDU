import CourseDetail from '@/app/course/[courseId]/course_detail';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function Page({ params }: PageProps) {
  const courseId = Number(params.courseId || 115); // fallback 默认值
  return <CourseDetail courseId={courseId} />;
}
