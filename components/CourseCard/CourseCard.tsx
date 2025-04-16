import React, { useState, useEffect } from 'react';
import { getCourseByCategory } from '@/app/api/Course/router';
import { useRouter } from 'next/navigation';
import "./CourseCard.css";
import { IoCaretForwardCircle } from "react-icons/io5";
import { Image } from '@mantine/core';

export type CourseCardInfo = {
    courseId?: number;
    url?: string;
    name?: string;
    institute?: string;
    category?: string;
    className?: string;
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
    url = 'placeholder.png',
    name = 'Course Name',
    category,
    institute = 'Institute Name',
    className = '',
}: CourseCardInfo) {
    return (
        <div className={`course-card ${className}`}>
            <img src={`/${url}`} alt="course" className="course-image" />
            <div className="course-info">
                <h3 className="course-name">{name}</h3>
                {category && <p className="course-category">{category}</p>}
                <div className="course-play">
                    {/* <IoCaretForwardCircle className="play-icon" /> */}
                    <span className="institute-name">{institute}</span>
                </div>
            </div>
        </div>
    );
}

export function CourseCardForProfile({
    url = 'placeholder.png',
    name = 'Course Name',
    category,
    institute = 'Institute Name',
    className = '',
}: CourseCardInfo) {
        return (
            <div className={`course-card-for-profile ${className}`}>
                <Image src={`/${url}`} alt="course" className="course-image-for-profile" style={{margin:'auto'}}></Image>
                <div className="course-info-for-profile">
                    <h3 className="course-name">{name}</h3>
                    {category && <p className="course-category">{category}</p>}
                    <div className="course-play">
                        {/* <IoCaretForwardCircle className="play-icon" /> */}
                        <span className="institute-name">{institute}</span>
                    </div>
                </div>
            </div>
        )
    }

