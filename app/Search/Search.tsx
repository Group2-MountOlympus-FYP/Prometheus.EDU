'use client'

import { useContext, useEffect, useState } from 'react';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import classes from '@/app/page.module.css';
import { getText } from './Language'
import { searchCourses } from '@/app/api/Course/router';
import { useSearchParams } from 'next/navigation';
import { LoadingContext } from '@/components/Contexts/LoadingContext';
import {Container, Stack, Title} from '@mantine/core';

export default function Search() {
  const { setIsLoading } = useContext(LoadingContext);
  const [searchData, setSearchData] = useState<any>(null);

  const Params = useSearchParams(); // ✅ 获取 Proxy 对象
  const queryParams = Params.get('q') ?? '';
  useEffect(() => {
    setIsLoading(true)
    const queryData = async(query:string) => {
      try {
        const result = await searchCourses(query);
        //console.log("搜索结果：", result);
        setSearchData(result);

        setIsLoading(false);
      } catch (error) {
        console.error("搜索失败", error);
        setIsLoading(false);
      }
    }

    queryData(queryParams);
  }, [])
  if(searchData){
    return (
      <Container style={{width:'100%'}}>
        <Title style={{marginBottom:'5vh'}}>{getText("searchingResult")} "{queryParams}"</Title>
        <Stack gap={"md"} style={{margin:'auto', width:'100%'}} align={"center"}>

          {searchData.map((course:any, index:any) => (

            <CourseCard
              key={course.id}
              courseId={course.id}
              name={course.course_name}
              institute={course.institution}
              category={course.category}
              className="courseCard"
              url={course.images?.[0]?.url}
              id={course.id}
            />
          ))}
        </Stack>
      </Container>
    )
  }else{
    return (
      <div className={classes.courseList}>
        <div className={classes.noResult}>
          <h2>No results found</h2>
        </div>
      </div>
    )
  }

}