import React from "react";
import "./CourseCard.css";
import { IoCaretForwardCircle } from "react-icons/io5";

export type CourseCardInfo = {
    courseId?: number;
    url?: string;
    name?: string;
    institute?: string;
    category?: string;
};

export function CourseCard({ url = 'courseSample.jpg', name = 'Course Name', category, institute = "Institute Name" }: CourseCardInfo) {
    return (
        <div className="course-card">
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
