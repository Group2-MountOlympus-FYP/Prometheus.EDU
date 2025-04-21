'use client';

import { AboutWebSite } from '@/components/AboutWebsite/AboutWebsite';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { useEffect, useState } from 'react';
import { CourseCardInfo } from '@/components/CourseCard/CourseCard';
import classes from './page.module.css'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import Link from 'next/link';
import { getCourseByCategory } from '@/app/api/Course/router';


export default function HomePage() {
  const categories: string[] = ['All','Computer Science', 'Math', 'Sports', 'Life', 'Art', 'Language', 'Others'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courses, setCourses] = useState<CourseCardInfo[]>([]);

  // 监听分类变化，获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (selectedCategory === 'All') {
          // 如果后端有专门的 "全部课程" 接口，可以用一个通用的 fetchAllCourses()
          const allCategories = categories.filter(cat => cat !== 'All');
          let allCourses: CourseCardInfo[] = [];
          for (const category of allCategories) {
            const data = await getCourseByCategory(category);
            const courses = await data.json();
            allCourses = [...allCourses, ...courses];
          }
          setCourses(allCourses);
        } else {
          const data = await getCourseByCategory(selectedCategory);
          const courses = await data.json();
          setCourses(courses);
        }
      } catch (error) {
        console.error('failed:', error);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  return (
    <div style={{ maxWidth: '100vw' }}>
      <AboutWebSite style={{ maxWidth: '100vw' }} />

      <div className={classes.courseContainer}>

        {/* 课程分类 */}
        <div className={classes.categoriesContainer}>
          <span className={classes.categoriesTitle}> Categories </span>
          <div className={classes.categoriesList}>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${classes.categoriesButton} ${selectedCategory === category ? classes.selected : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 课程列表 */}
        <div className={classes.courseList}>
          {courses.map((course, index) => (
            <Link
              href={`/course/${course.courseId}`}
              key={index}
              style={{ textDecoration: 'none' }}
              className={classes.courseLink}
            >
              <CourseCard {...course} />
            </Link>
          ))}
        </div>

      </div>

      <div className={classes.cookieConsent}>
        <CookieConsent />
      </div>
    </div>
  );
}