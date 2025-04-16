"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Divider,
  Group,
  Stack,
  Skeleton,
} from "@mantine/core";
import VideoList from "./component/course_video_list";
import Teachers_list from "@/app/course/[courseId]/component/teachers_list";
import CourseHeader from "@/app/course/[courseId]/component/course_card";
import { getCourseDetailsById } from "@/app/api/Course/router";

interface CourseProps {
  courseId: number;
}

const CourseDetail: React.FC<CourseProps> = ({ courseId }) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCourseDetailsById(courseId)
      .then((res) => {
        if (!res || res.detail === "Course not found") {
          setError(true);
        } else {
          setCourseData(res);
        }
      })
      .catch((err) => {
        console.error("获取课程失败：", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
  }

  if (error || !courseData) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>❌ 404 Not Found</h1>
        <p>The course does not exist or has been deleted</p>
      </div>
    );
  }

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
