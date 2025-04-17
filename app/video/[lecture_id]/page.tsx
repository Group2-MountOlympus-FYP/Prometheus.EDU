import Lecture from './lecture'

export default async function Page({ params }: { params: { lecture_id: string } }) {
    const lectureParams = await params;
    return <Lecture lectureId={parseInt(lectureParams.lecture_id, 10)} />
}
