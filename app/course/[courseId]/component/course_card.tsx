"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Grid, Stack, Title, Text, Button, Group, Badge, Image
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { getCourseDetailsById } from '@/app/api/Course/router';
import "./course_card.css";
import {enrollCourseById} from "@/app/api/Enroll/router";
import {checkEnrollmentStatus} from "@/app/api/MyCourses/router";



interface CourseHeaderProps {
  lectureId?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ lectureId = 115 }) => {
  const [data, setData] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);


  useEffect(() => {
    getCourseDetailsById(lectureId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("加载课程信息失败", err);
      });

    checkEnrollmentStatus(lectureId)
      .then((isEnrolled) => {
        setIsEnrolled(isEnrolled);
      })
      .catch((err) => {
        console.error("检查报名状态失败", err);
      });
  }, [lectureId]);


  if (!data) return null;

  return (
    <div className="course-card">
      <div className="course-left">
        <Stack>
          <Title order={1}>{data.course_name || "Course Name"}</Title>
          <Text size="lg" color="dimmed">{data.institution || "Institute Name"}</Text>

          {(data.rating ?? 0) > 0 ? (
            <Group>
              {Array.from({ length: Math.min(data.rating ?? 0, 5) }).map((_, i) => (
                <IconStarFilled key={i} size={20} color="#f1c40f" />
              ))}
            </Group>
          ) : (
            <Text size="sm" color="dimmed">No rating</Text>
          )}


          <Button
            color={isEnrolled ? "gray" : "indigo"}
            size="md"
            className="enroll-button"
            onClick={async () => {
              try {
                await enrollCourseById(lectureId);
                // ✅ 报名成功后重新验证是否报名（确保后端写入成功）
                const confirmed = await checkEnrollmentStatus(lectureId);
                setIsEnrolled(confirmed);
                alert("报名成功！");
              } catch (err) {
                console.error("报名失败", err);
                alert("报名失败，请稍后再试");
              }
            }}
            disabled={isEnrolled}
          >
            {isEnrolled ? "Enrolled" : "Enroll to this course"}
          </Button>



          <Text size="sm" color="dimmed">
            {data.enrollment_count || 0} people have enrolled
          </Text>

          <Text size="sm" className="course-intro">
            {data.description || "No description available."}
          </Text>

          <Group mt="sm">
            {(data.tags || []).map((tag: string, i: number) => (
              <Badge variant="outline" key={i}>{tag.toUpperCase()}</Badge>
            ))}
          </Group>
        </Stack>
      </div>


      <div className="course_right">
        <Image
          className="course_image"
          src={typeof data.images?.[0] === "string" ? data.images[0] : "/course_pic.png"}
          alt="Course Image"
          radius="md"
        />
      </div>
    </div>
  );
};

export default CourseHeader;
