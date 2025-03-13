'use client';

import { AboutWebSite } from '@/components/AboutWebsite/AboutWebsite';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { useState } from 'react';
import { Group, SimpleGrid } from '@mantine/core';
import { CourseCardInfo } from '@/components/CourseCard/CourseCard';
import classes from './page.module.css'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';

export default function HomePage() {
  const courseCardProps: CourseCardInfo[] = [
    { playCount: 1532, url: 'courseSample.jpg', name: 'COMP3030J' },
    { playCount: 212, url: 'courseSample.jpg', name: 'COMP1004J' },
    { playCount: 44555, url: 'courseSample.jpg', name: 'Computer Science' },
    { playCount: 29347290, url: 'courseSample.jpg', name: 'Python' },
    { playCount: 1, url: 'courseSample.jpg', name: 'Java' },
    { playCount: 2423, url: 'courseSample.jpg', name: 'C++' },
    { playCount: 35354, url: 'courseSample.jpg', name: 'Cook' },
    { playCount: 384989, url: 'courseSample.jpg', name: 'Cycling' },
    { playCount: 22, url: 'courseSample.jpg', name: 'React' },
  ]

  const categories: string[] = ['CS', 'Sports', 'Life', 'Art', 'Math', 'Language','Others']

  return (
    <div style={{maxWidth: '100vw'}}>
      <AboutWebSite style={{maxWidth: '100vw'}}></AboutWebSite>
      <Group gap={10} className={classes.categoriesGroup}>
        <span className={classes.categoriesTitle}>Categories: </span>
        {
          categories.map((category, index) => (
            <button key={index} className={classes.categoriesButton}>{category}</button>
          ))
        }
      </Group>
      <SimpleGrid cols={6} spacing='lg' style={{margin: '0 2vw 0 2vw'}}>
        {  
          courseCardProps.map((course, index) => (
            <CourseCard key={index} {...course}></CourseCard>
          ))
        }
      </SimpleGrid>
      <div className={classes.cookieConsent}>
        <CookieConsent/>
      </div>
    </div>
  );
}
