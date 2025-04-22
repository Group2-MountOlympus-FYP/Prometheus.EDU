import { CourseCardForProfile } from "@/components/CourseCard/CourseCard"
import { SimpleGrid } from "@mantine/core"
import "./../profile.css"

interface Prop{
    data: any[]
}

export function MyCourse(props: Prop){

    return (
        <div>
            <SimpleGrid cols={3} style={{margin:'auto', width:'70vw'}}>
                {props.data.map((course: any, index: number) => (
                    <CourseCardForProfile 
                    key={course.course.id}
                    courseId={course.course.id}
                    name={course.course.course_name}
                    institute={course.course.institution}
                    category={course.course.category}
                    className="courseCard"
                    url={course.course.images?.[0]?.url}
                    id={course.course.id}
                    ></CourseCardForProfile>
                ))}
            </SimpleGrid>
        </div>
    )
}