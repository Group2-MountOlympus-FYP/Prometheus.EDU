'use client';

import { AboutWebSite } from '@/components/AboutWebsite/AboutWebsite';
import { Grid, Stack, Skeleton } from "@mantine/core"
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { useEffect, useState, useContext } from 'react';
import { SessionContext } from "@/components/Contexts/SessionContext"
import { CourseCardInfo } from '@/components/CourseCard/CourseCard';
import classes from './page.module.css'
import { getText } from './language'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { getCourseByCategory, getCourseByRecommend } from '@/app/api/Course/router';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  const categories: { label: string, value: string }[] = [
    { label: getText('recommended'), value: 'All' },
    { label: getText('computerScience'), value: 'Computer Science' },
    { label: getText('math'), value: 'Math' },
    { label: getText('sport'), value: 'Sport' },
    { label: getText('life'), value: 'Life' },
    { label: getText('art'), value: 'Art' },
    { label: getText('language'), value: 'Language' },
    { label: getText('others'), value: 'Others' },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();
  const [isCoursesLoading, setIsCoursesLoading] = useState<boolean>(true)
  const { isLogin } = useContext(SessionContext)

  // 监听分类变化，获取课程数据
  useEffect(() => {
    // 开始加载
    setIsCoursesLoading(true)
    const fetchCourses = async () => {
      try {
        if (selectedCategory === 'All') {
          // 如果已登录，返回推荐课程
          if (isLogin) {
            const data = await getCourseByRecommend();
            //console.log("get Recommend")
            const recommendedCourses = await data.json();
            //console.log(recommendedCourses)
            setCourses(recommendedCourses);
          // 如果未登录，返回所有课程
          } else {
            const allCategories = categories.filter(cat => cat.value !== 'All');
            let allCourses: CourseCardInfo[] = [];
            for (const category of allCategories) {
              const data = await getCourseByCategory(category.value);
              //console.log("get All")
              const courses = await data.json();
              allCourses = [...allCourses, ...courses];
            }
            setCourses(allCourses);
          }
        } else {
          const data = await getCourseByCategory(selectedCategory);
          const courses = await data.json();
          console.log("get data", courses)
          setCourses(courses);
        }
        // 加载结束
        setIsCoursesLoading(false)
      } catch (error) {
        console.error('failed:', error);
      }
    };

    fetchCourses();
  }, [selectedCategory]);

  return (    
    <div style={{ maxWidth: '100vw',}}>
      <AboutWebSite style={{ maxWidth: '100vw' }} />

      <div className={classes.courseContainer}>

        {/* 课程分类 */}
        <div className={classes.categoriesContainer}>
          <span className={classes.categoriesTitle}> {getText('categories')} </span>
          <div className={classes.categoriesList}>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${classes.categoriesButton} ${selectedCategory === category.value ? classes.selected : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {
          !isCoursesLoading ? (
            // 课程列表
            <div className={classes.courseList}>
              {courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/course/${course.id}`)}
                  className={classes.courseCardBox}
                  style={{ cursor: 'pointer' }}
                >
                  <CourseCard
                    courseId={course.id}
                    name={course.course_name}
                    institute={course.lectures[0]?.author.username}
                    category={course.category}
                    className="courseCardMain"
                    url={course.images?.[0]?.url}
                    id={course.id}
                    level={course.level}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Stack gap="lg" style={{ margin:"auto", width: "70%" }}>
              <Skeleton height={75} radius="xl" />
              <Skeleton height={75} radius="xl" />
              <Skeleton height={75} radius="xl" />
              <Skeleton height={75} radius="xl" />
              <Skeleton height={75} radius="xl" />
            </Stack>
          )
        }


      <div className={classes.cookieConsent}>
        <CookieConsent />
      </div>
      </div>

    </div>
  );
}