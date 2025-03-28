// app/video/[lecture_id]/page.tsx
import Course from './lecture'

export default function Page({ params }: { params: { lecture_id: string } }) {
    return <Course lectureId={parseInt(params.lecture_id, 10)} />
}
