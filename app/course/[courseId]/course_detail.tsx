"use client";
import React, { useEffect } from 'react';
import {
  Container, Title, Text, Grid, Avatar, Divider, Badge, Group, Stack, Image
} from '@mantine/core';
import VideoList from './component/course_video_list';
import Teachers_list from '@/app/course/[courseId]/component/teachers_list';
import CourseHeader from '@/app/course/[courseId]/component/course_card';

interface CourseProps {
  courseId: number;
}

const CourseDetail: React.FC<CourseProps> = ({ courseId }) => {
  useEffect(() => {
    console.log("✅ 当前课程 lectureId:", courseId);
  }, [courseId]);

  return (
    <Container size="lg" className="course-container">
      {/* Header */}
      <Grid align="center" gutter="xl" className="course-header">
        <Grid.Col span={8}>
          <CourseHeader lectureId={courseId} />
        </Grid.Col>


      </Grid>

      {/* Lecturers */}
      <Group wrap="wrap">
        <Teachers_list lectureId={courseId} />
      </Group>

      <Divider my="xl" />

      {/* Syllabus */}
      <Stack>
        <VideoList currentLectureId={courseId} />
      </Stack>
    </Container>
  );
};

export default CourseDetail;
