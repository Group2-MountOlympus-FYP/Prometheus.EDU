'use client';

import { useEffect, useState } from 'react';
import { getMyCourses } from '@/app/api/MyCourses/router';
import { Card, Image, Text, Badge, Group, Stack, Loader } from '@mantine/core';
import { useRouter } from 'next/navigation';



interface Course {
  id: number;
  course_name: string;
  description: string;
  institution: string;
  level: string;
  rating: number;
  type: string;
}

interface EnrolledCourse {
  course: Course;
  progress: number;
  enrollment_date: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    getMyCourses()
      .then(async (response) => {
        const res = await response.json();
        if (Array.isArray(res)) {
          setCourses(res); // ✅ 安全设置
        } else {
          console.error('返回值不是数组:', res);
          setCourses([]); // fallback 空数组
        }
      })
      .catch((err) => {
        console.error('加载课程失败', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  if (loading) {
    return <Loader color="indigo" size="lg" />;
  }

  return (
    <Stack p="lg">
      <Text size="xl" fw={700}>My Courses</Text>
      {courses.map((item, idx) => (
        <Card
          key={idx}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={() => {

              router.push(`/course/${item.course.id}`);
          }}
        >

        <Group align="flex-start" justify="space-between">
            <Stack gap="xs">
              <Text fw={600} size="lg">{item.course.course_name}</Text>
              <Text size="sm" c="dimmed">{item.course.institution}</Text>
              <Text size="sm">{item.course.description}</Text>
              <Group>
                <Badge color="teal">{item.course.level}</Badge>
                <Badge color="blue">Progress: {item.progress}%</Badge>
              </Group>
              <Text size="xs" c="gray">Enrolled on: {new Date(item.enrollment_date).toLocaleDateString()}</Text>
            </Stack>
            <Image
              src="/course_pic.png" // 可替换为 item.course.image || 默认图
              width={120}
              height={80}
              radius="md"
              alt="Course Thumbnail"
            />
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
