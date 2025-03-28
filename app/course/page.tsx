import CourseDetail from '@/app/course/course_detail';

interface PageProps {
  params: {
    lecture_id: string;
  };
}

export default function Page({ params }: PageProps) {
  const lectureId = Number(params.lecture_id || 115); // fallback 默认值
  return <CourseDetail lectureId={lectureId} />;
}
