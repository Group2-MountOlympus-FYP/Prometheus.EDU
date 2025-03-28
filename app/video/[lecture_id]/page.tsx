import Lecture from './lecture'

export default function Page({ params }: { params: { lecture_id: string } }) {
    return <Lecture lectureId={parseInt(params.lecture_id, 10)} />
}
