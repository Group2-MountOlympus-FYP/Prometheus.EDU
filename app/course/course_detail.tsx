"use client";
import React, { useEffect } from 'react';
import {
  Container, Title, Text, Grid, Avatar, Divider, Badge, Group, Stack, Image
} from '@mantine/core';
import './course_details.css';
import VideoList from '../video/[lecture_id]/components/video_list';
import Teachers_list from '@/app/course/component/teachers_list';
import CourseHeader from '@/app/course/component/course_card';

interface CourseProps {
  lectureId: number;
}

const CourseDetail: React.FC<CourseProps> = ({ lectureId }) => {
  useEffect(() => {
    console.log("✅ 当前课程 lectureId:", lectureId);
  }, [lectureId]);

  return (
    <Container size="lg" className="course-container">
      {/* Header */}
      <Grid align="center" gutter="xl" className="course-header">
        <Grid.Col span={8}>
          <CourseHeader lectureId={lectureId} />
        </Grid.Col>


      </Grid>

      {/* Lecturers */}
      <Group wrap="wrap">
        <Teachers_list lectureId={lectureId} />
      </Group>

      <Divider my="xl" />

      {/* Syllabus */}
      <Stack>
        <VideoList currentLectureId={lectureId} />
      </Stack>
    </Container>
  );
};

export default CourseDetail;
