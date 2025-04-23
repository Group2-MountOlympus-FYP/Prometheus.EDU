'use client';

import { useEffect, useState } from 'react';
import { getMyCourses } from '@/app/api/MyCourses/router';
import { getUserProfile } from '@/app/api/User/router';
import { Card, Image, Text, Badge, Group, Stack, Loader, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getText } from './language';

interface Course {
  id: number;
  course_name: string;
  description: string;
  institution: string;
  level: string;
  rating: number;
  type: string;
  images: Array<{ url: string }>;
}

interface EnrolledCourse {
  course: Course;
  enrollment_date: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [userStatus, setUserStatus] = useState<"TEACHER" | "NORMAL" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, profile] = await Promise.all([
          getMyCourses(),
          getUserProfile(),
        ]);

        const res = await coursesRes.json();
        if (Array.isArray(res)) {
          setCourses(res);
        } else {
          setCourses([]);
        }

        if (profile.status === 'TEACHER' || profile.status === 'NORMAL') {
          setUserStatus(profile.status);
        }
      } catch (err) {
        console.error(getText('load_failed'), err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loader color="indigo" size="lg" />;
  }

  return (
    <Stack p="lg">
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700}>{getText("my_courses")}</Text>
        {userStatus === 'TEACHER' && (
          <Button color="teal" onClick={() => router.push("/course/create")}>
            + {getText("create_course")}
          </Button>
        )}
      </Group>

      {courses.map((item, idx) => (
        <Card
          key={idx}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={() => router.push(`/course/${item.course.id}`)}
        >
          <Group align="flex-start" justify="space-between">
            <Stack gap="xs">
              <Text fw={600} size="lg">{item.course.course_name}</Text>
              <Text size="sm" c="dimmed">{item.course.institution}</Text>
              <Text size="sm">{item.course.description}</Text>
              <Group>
                <Badge color="teal">{item.course.level}</Badge>
              </Group>
              <Text size="xs" c="gray">
                {getText("enrolled_on")}: {new Date(item.enrollment_date).toLocaleDateString()}
              </Text>
            </Stack>
            <Image
              src={item.course.images?.[0]?.url || "/course_pic.png"}
              width={120}
              height={80}
              radius="md"
              alt={item.course.course_name}
            />
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
