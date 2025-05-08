"use client";
import React, { useState } from "react";
import {
  Stack, Title, Text, Button, Group, Badge, Image,
  Grid,
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { enrollCourseById } from "@/app/api/Enroll/router";
import { checkEnrollmentStatus } from "@/app/api/MyCourses/router";
import "./course_card.css";
import { getText } from "./language";
import {notifications} from "@mantine/notifications";
import { useDisclosure } from '@mantine/hooks';
import CourseUpdateModal from '../../create/component/update_course_detail'; // 路径改为你实际文件路径


interface CourseHeaderProps {
  courseData: any;
  isEnrolled: boolean;
  userStatus: "STUDENT" | "TEACHER" | null;
  onEnrolled: () => void
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseData, isEnrolled, userStatus, onEnrolled }) => {
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const courseId = courseData.id;
  const [isEnrollLoading, setIsEnrollLoading] = useState(true)
  const [enrolledNumber, setEnrolledNumber] = useState(courseData.enrollment_count)
  const [opened, { open, close }] = useDisclosure(false);



  if (!courseData) return null;

  const handleEnroll = async() => {
    try {

      notifications.show({
        id: 'enrollNotification',
        message: getText("Loading"),
        loading: isEnrollLoading,
        autoClose: false,
      });

      await enrollCourseById(courseId);
      const confirmed = await checkEnrollmentStatus(courseId);
      setEnrolled(confirmed);
      setIsEnrollLoading(false)
      onEnrolled()
      setEnrolledNumber(enrolledNumber + 1)

      setTimeout(() => {
        notifications.hide('enrollNotification');
      }, 1500); //
    } catch (err) {
      console.error("报名失败", err);
      notifications.show({
        message: getText("Lecture_exist"),
        color: 'red',
      });
    }
  }

  const toAddLecture = () =>{
    window.location.href = `/course/${courseId}/add_lecture`;
  }

  return (
    <div className="course-card-header">
      <Grid>
        <Grid.Col span={8} className={"course-card-header-left"}>
          <Stack gap={"sm"}>
            <Title order={2}>{courseData.course_name || getText("no_title")}</Title>
            <Badge
              variant="filled"
              style={{
                backgroundColor: '#20c997', // 固定绿色背景
                color: 'white',
                border: '1px solid #20c997', // 边框同色
              }}
            >
              {courseData.level || 'N/A'}
            </Badge>

            <Text size="sm" className="course-intro">
              {courseData.description || getText("no_intro")}
            </Text>


            {userStatus === "TEACHER" ? (
              <>
                <Button
                  color="teal"
                  size="md"
                  className="create-lecture-button"
                  onClick={toAddLecture}
                >
                  {getText("post")}
                </Button>

                <Button
                  color="blue"
                  size="md"
                  className="update-course-button"
                  onClick={open}
                >
                  {getText("update_course")}
                </Button>

              </>
            ) : (
              <Button
                color={enrolled ? "gray" : "indigo"}
                className="enroll-button"
                onClick={handleEnroll}
                disabled={enrolled}
              >
                {enrolled ? getText("enrolled") : getText("enroll")}
              </Button>
            )}

            <Text size="sm" color="dimmed">
              {enrolledNumber + " " + getText("people_have_enrolled")}
            </Text>


          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack gap={"sm"}>
            <img
              className="course_image"
              src={courseData.images?.[0]?.url || "/course_pic.png"}
              alt="Course Image"
            />
            <Group mt="sm">
              {(courseData.tags || []).map((tag: string, i: number) => (
                <Badge variant="outline" key={i}>{tag.toUpperCase()}</Badge>
              ))}
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>

      <CourseUpdateModal
        opened={opened}
        onClose={close}
        courseId={courseId}
      />


      <div id={"circle-left"} className={"circle"}></div>
      <div id={"circle-right"} className={"circle"}></div>

    </div>
  );
};

export default CourseHeader;
