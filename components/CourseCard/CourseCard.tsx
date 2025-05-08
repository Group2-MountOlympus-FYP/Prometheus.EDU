
import React from 'react';
import "./CourseCard.css";
import { Badge, Image } from '@mantine/core';
import { useRouter } from "next/navigation";

export type CourseCardInfo = {
    courseId?: number;
    url?: string;
    name?: string;
    institute?: string;
    category?: string;
    className?: string;
    id: number;
    level: string,
};


// const VideoList: React.FC<VideoListProps> = ({ currentLectureId }) => {

//     const handleCardClick = (id: number) => {
//         router.push(`/video/${id}`);
//     };

// }

// interface CourseCardProps extends CourseCardInfo {
//     onClick?: () => void;
//   }
  
// export const CourseList: React.FC<CourseCardProps> = ({ id, url, name, category, institute, onClick }) => {
//     return (
//     );
// }


export function CourseCard({
    url = '/placeholder.png',
    name = 'Course Name',
    category = 'Unknown Category',
    institute = 'Unknown Institute',
    className = '',
    id,
    level,
}: CourseCardInfo) {
    return (
        <div className={`course-card-for-main ${className}`}>
            <img src={url} alt="course" className="course-image" />
            <div className="course-info">
                <h3 className="course-name">{name}</h3>
                {category && <p className="course-category">{category}</p>}
                <div className="course-play">
                    {/* <IoCaretForwardCircle className="play-icon" /> */}
                    <span className="institute-name">{institute}</span>
                </div>
                <Badge variant="filled"
                       style={{
                           backgroundColor: '#20c997', // 固定绿色背景
                           color: 'white',
                           border: '1px solid #20c997', // 边框同色
                       }}>{level}</Badge>
            </div>
        </div>
    );
}

export function CourseCardForProfile({
    url = '/placeholder.png',
    name = 'Course Name',
    category = 'Unknown Category',
    institute = 'Unknown Institute',
    className = '',
    id,
    level,
}: CourseCardInfo) {

    const router = useRouter()

    const toCourseDetail = () => {
        router.push(`/course/${id}`)
    }
        return (
            <div className={`course-card-for-profile ${className}`} onClick={toCourseDetail} style={{cursor:'pointer'}}>
                {/* <Link href={`/course/${id}`}> */}
                <img src={url} alt="course" className="course-image-for-profile" style={{margin:'auto'}}></img>
                <div className="course-info-for-profile">
                    <h3 className="course-name" >{name}</h3>
                    {category && <p className="course-category">{category}</p>}
                    <div className="course-play">
                        {/* <IoCaretForwardCircle className="play-icon" /> */}
                        <span className="institute-name">{institute}</span>
                    </div>
                    <Badge variant="filled"
                           style={{
                               backgroundColor: '#20c997', // 固定绿色背景
                               color: 'white',
                               border: '1px solid #20c997', // 边框同色
                           }}>{level}</Badge>
                </div>
                {/* </Link> */}
            </div>
        )
    }

