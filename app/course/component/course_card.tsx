"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Grid, Stack, Title, Text, Button, Group, Badge, Image
} from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { getCourseDetailsById } from '@/app/api/Course/router';
import "./course_card.css";
import CoursePic from "../../../public/course_pic.png";


interface CourseHeaderProps {
  lectureId?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ lectureId = 115 }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getCourseDetailsById(lectureId)
      .then((res) => {
        console.log("课程详情数据", res);
        setData(res);
      })
      .catch((err) => {
        console.error("加载课程信息失败", err);
      });
  }, [lectureId]);

  if (!data) return null;

  return (
    <Container size="lg" className="course-container">
      <Grid align="center" gutter="xl" className="course-header">
        <Grid.Col span={8}>
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


            <Button color="indigo" size="md" className="enroll-button">
              Enroll to this course
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
        </Grid.Col>

        <Grid.Col span={4}>
          <Image
            src={
              typeof data.images?.[0] === "string"
                ? data.images[0]
                : "/course_pic.png"  // ✅ 前面加斜杠表示从 public 根路径开始
            }
            alt="Course Image"
            radius="md"
          />


      </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CourseHeader;
