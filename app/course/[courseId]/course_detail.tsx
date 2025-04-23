"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Title, Text, Grid, Divider, Group, Stack, Skeleton,
} from "@mantine/core";

import CourseHeader from "@/app/course/[courseId]/component/course_card";
import Teachers_list from "@/app/course/[courseId]/component/teachers_list";
import VideoList from "@/app/course/[courseId]/component/course_video_list";

import { getCourseDetailsById } from "@/app/api/Course/router";
import { checkEnrollmentStatus } from '@/app/api/MyCourses/router';
import { getUserProfile } from "@/app/api/User/router";

interface CourseProps {
  courseId: number;
}

const CourseDetail: React.FC<CourseProps> = ({ courseId }) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userStatus, setUserStatus] = useState<"STUDENT" | "TEACHER" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [course, enrolled, profile] = await Promise.all([
          getCourseDetailsById(courseId),
          checkEnrollmentStatus(courseId),
          getUserProfile(),
        ]);

        if (!course || course.detail === "Course not found") {
          setError(true);
        } else {
          setCourseData(course);
          setIsEnrolled(enrolled);
          if (profile.status === "STUDENT" || profile.status === "TEACHER") {
            setUserStatus(profile.status);
          } else {
            console.warn("⚠️ 未知用户身份:", profile.status);
          }
        }
      } catch (err) {
        console.error("数据获取失败：", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
          <CourseHeader
            courseData={courseData}
            isEnrolled={isEnrolled}
            userStatus={userStatus}
          />
        </Grid.Col>
      </Grid>

      {/* Teachers */}
      <Group wrap="wrap">
        <Teachers_list lecturers={courseData.teachers || []} />
      </Group>

      <Divider my="xl" />

      {/* Videos */}
      <Stack>
        <VideoList
          isEnrolled={isEnrolled}
          videos={(courseData.lectures || []).map((item: any) => ({
            id: item.id,
            title: item.name || item.title || '无标题',
            lastUpdated: item.created_at || '未知时间',
          }))}
        />
      </Stack>
    </Container>
  );
};

export default CourseDetail;
