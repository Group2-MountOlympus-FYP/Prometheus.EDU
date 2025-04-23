"use client";
import React, { useState } from "react";
import {
  Stack, Title, Text, Button, Group, Badge, Image,
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { enrollCourseById } from "@/app/api/Enroll/router";
import { checkEnrollmentStatus } from "@/app/api/MyCourses/router";
import "./course_card.css";
import { getText } from "./language";

interface CourseHeaderProps {
  courseData: any;
  isEnrolled: boolean;
  userStatus: "NORMAL" | "TEACHER" | null;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseData, isEnrolled, userStatus }) => {
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const courseId = courseData.id;

  if (!courseData) return null;

  return (
    <div className="course-card">
      <div className="course-left">
        <Stack>
          <Title order={1}>{courseData.course_name || getText("no_title")}</Title>
          <Text size="lg" color="dimmed">{courseData.institution || getText("unknown_institution")}</Text>

          {(courseData.rating ?? 0) > 0 ? (
            <Group>
              {Array.from({ length: Math.min(courseData.rating, 5) }).map((_, i) => (
                <IconStarFilled key={i} size={20} color="#f1c40f" />
              ))}
            </Group>
          ) : (
            <Text size="sm" color="dimmed">{getText("no_title")}</Text>
          )}

          {userStatus === "TEACHER" ? (
            <Button
              color="teal"
              size="md"
              className="create-lecture-button"
              onClick={() => {
                window.location.href = `/course/${courseId}/add_lecture`;
              }}
            >
              {getText("post")}
            </Button>
          ) : (
            <Button
              color={enrolled ? "gray" : "indigo"}
              size="md"
              className="enroll-button"
              onClick={async () => {
                try {
                  await enrollCourseById(courseId);
                  const confirmed = await checkEnrollmentStatus(courseId);
                  setEnrolled(confirmed);
                  alert(getText("Loading")); // ✅ 你可以加一个新 key，比如 enroll_success
                } catch (err) {
                  console.error("报名失败", err);
                  alert(getText("Lecture_exist")); // 可替换成 "enroll_failed"
                }
              }}
              disabled={enrolled}
            >
              {enrolled ? getText("enrolled") : getText("enroll")}
            </Button>
          )}

          <Text size="sm" color="dimmed">
            {(courseData.enrollment_count || 0) + " " + getText("people_have_enrolled")}
          </Text>

          <Text size="sm" className="course-intro">
            {courseData.description || getText("no_title")}
          </Text>

          <Group mt="sm">
            {(courseData.tags || []).map((tag: string, i: number) => (
              <Badge variant="outline" key={i}>{tag.toUpperCase()}</Badge>
            ))}
          </Group>
        </Stack>
      </div>

      <div className="course_right">
        <Image
          className="course_image"
          src={courseData.images?.[0]?.url || "/course_pic.png"}
          alt="Course Image"
          radius="md"
        />
      </div>
    </div>
  );
};

export default CourseHeader;
