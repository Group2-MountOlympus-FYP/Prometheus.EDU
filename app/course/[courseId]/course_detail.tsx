"use client";
import React, { useContext, useEffect, useState } from 'react';
import {
    Container, Title, Text, Grid, Divider, Group, Stack, Skeleton, Image, Avatar
} from "@mantine/core";

import CourseHeader from "@/app/course/[courseId]/component/course_card";
import VideoList from "@/app/course/[courseId]/component/course_video_list";
import { LectureListForCourseDetail } from "@/app/course/[courseId]/component/teachers_list";

import { getCourseDetailsById } from "@/app/api/Course/router";
import { checkEnrollmentStatus } from '@/app/api/MyCourses/router';
import { getText } from "./component/language";
import { getUserInfo } from "@/app/api/General";
import { LoadingContext } from "@/components/Contexts/LoadingContext";

interface CourseProps {
  courseId: number;
}

const CourseDetail: React.FC<CourseProps> = ({ courseId }) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userStatus, setUserStatus] = useState<"STUDENT" | "TEACHER" | null>(null);
  const [error, setError] = useState(false);
  const { isLoading, setIsLoading } = useContext(LoadingContext);


  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      try {
        const [course, enrolled, profile] = await Promise.all([
          getCourseDetailsById(courseId),
          checkEnrollmentStatus(courseId),
          getUserInfo(),
        ]);

        if (!course || course.detail === "Course not found") {
          setError(true);
        } else {
          //console.log(course)
          setCourseData(course);
          setIsEnrolled(enrolled);
          if (profile?.userType === "STUDENT" || profile?.userType === "TEACHER") {
            setUserStatus(profile.userType);
          } else {
            console.warn("⚠️ 未知用户身份:", profile?.userType);
          }
        }
      } catch (err) {
        console.error("数据获取失败：", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [courseId]);


  if (error || !courseData) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>❌ 404 Not Found</h1>
        <p>The course does not exist or has been deleted</p>
      </div>
    );
  }

  return (
    <div className="course-container">
      {/* Header */}
      <Stack align="stretch">
          <CourseHeader
              courseData={courseData}
              isEnrolled={isEnrolled}
              userStatus={userStatus}
              onEnrolled={() => setIsEnrolled(true)}
          />
      </Stack>

      <Container size={"90vw"}>
        <Group  align="center" mt="xl" mb="md">
          <Title order={3} style={{ margin: 0 }}>
            {getText("course_lecturers") || "Course Lecturers"}
          </Title>
          <div style={{ marginTop: 0 }}>
            <LectureListForCourseDetail lecturers={courseData.teachers || []} />
          </div>
        </Group>


        <Divider my="xl" />

          {/* Videos */}
          <Stack>
              <VideoList
                  isEnrolled={isEnrolled}
                  videos={(courseData.lectures || []).map((item: any) => ({
                      id: item.id,
                      title: item.name || getText('no_title'),
                      lastUpdated: item.created_at || getText('no_time'),
                  }))}
              />
          </Stack>
      </Container>

      <img src={'/categories.png'}
        style={{
          position: "fixed",
          bottom: "3%",
          right: "5%",
          height: "35vh",
          width: "35vh",
          zIndex: -9999,
          pointerEvents: "none",
          objectFit: "cover",
          opacity: 0.15,
        }}/>
    </div>
  );
};

export default CourseDetail;


