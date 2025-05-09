'use client';

import {useContext, useEffect, useState} from 'react';
import { getMyCourses } from '@/app/api/MyCourses/router';
import { getUserProfile } from '@/app/api/User/router';
import { Card, Image, Text, Badge, Group, Stack, Loader, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getText } from './language';
import {LoadingContext} from "@/components/Contexts/LoadingContext";
import './my_course.css';

interface Course {
  id: number;
  course_name: string;
  description: string;
  author: string,
  level: string;
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
  const { isLoading, setIsLoading } = useContext(LoadingContext)
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    fetchData();
  }, []);

  if(isLoading){
    return (
        <div></div>
    )
  }

  return (
    <Stack p="lg" style={{marginLeft:'5vw', marginTop:'-2vh'}}>
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
            <Stack gap="xs" style={{ flex: 1, cursor:'pointer' }}>
              <Text fw={600} size="lg">{item.course.course_name}</Text>
              <Text size="sm" c="dimmed">Institute: {item.course.author}</Text>

                <Text size="sm" lineClamp={1}>
                  Description: {item.course.description}
                </Text>
              <Group>
                <Badge
                  variant="filled"
                  style={{
                    backgroundColor: '#20c997', // 固定绿色背景
                    color: 'white',
                    border: '1px solid #20c997', // 边框同色
                  }}
                >
                  {item.course.level || 'N/A'}
                </Badge>
              </Group>
              <Text size="xs" c="gray">
                {getText("enrolled_on")}: {new Date(item.enrollment_date).toLocaleDateString()}
              </Text>
            </Stack>
            <img
              src={item.course.images?.[0]?.url || "/course_pic.png"}
              width={200}
              height={120}
              alt={item.course.course_name}
              style={{ borderRadius: 8, flexShrink: 0, objectFit: 'cover' }}
            />
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
