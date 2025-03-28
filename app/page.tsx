'use client';

import { AboutWebSite } from '@/components/AboutWebsite/AboutWebsite';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { useState } from 'react';
import { Group, SimpleGrid } from '@mantine/core';
import { CourseCardInfo } from '@/components/CourseCard/CourseCard';
import classes from './page.module.css'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';

export default function HomePage() {
  const allCourses: CourseCardInfo[] = [
    { url: 'placeholder.png', name: 'Program Design', category: 'Computer Science', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'Python', category: 'Computer Science', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'Java', category: 'Computer Science', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'C++', category: 'Computer Science', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'Cooking', category: 'Life', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'Cycling', category: 'Sports', institute: "Beijing University of Technology" },
    { url: 'placeholder.png', name: 'React', category: 'Computer Science', institute: "Beijing University of Technology" },
  ];

  const categories: string[] = ['All','Computer Science', 'Math', 'Sports', 'Life', 'Art', 'Language', 'Others'];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 筛选课程
  const filteredCourses = selectedCategory === 'All' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  return (
    <div style={{ maxWidth: '100vw' }}>
      <AboutWebSite style={{ maxWidth: '100vw' }} />

      <div className={classes.courseContainer}>
      
      {/* 课程分类 */}
      <div className={classes.categoriesContainer}>
        <span className={classes.categoriesTitle}>Categories: </span>
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
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>

      </div>

      <div className={classes.cookieConsent}>
        <CookieConsent />
      </div>
    </div>
  );
}
