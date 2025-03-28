"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Text, Group, Stack, Title } from "@mantine/core";
import { getCourseDetailsById } from '@/app/api/Course/router';

interface Lecturer {
  username: string;
}

interface LecturerListProps {
  lectureId?: number; // 可选参数
}

const LecturerList: React.FC<LecturerListProps> = ({ lectureId = 115 }) => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  useEffect(() => {
    getCourseDetailsById(lectureId)
      .then((data) => {
        if (data.teachers && Array.isArray(data.teachers)) {
          setLecturers(data.teachers);
        } else {
          console.warn("接口返回数据格式异常:", data);
        }
      })
      .catch((err) => {
        console.error("获取讲师信息失败：", err);
      });
  }, [lectureId]);

  return (
    <>
      <Title order={3} mt="xl" mb="md">
        Course Lecturers
      </Title>
      <Group wrap="wrap" gap="xl">
        {lecturers.map((lecturer, index) => (
          <Stack align="center" key={index} gap={4}>
            <Avatar radius="xl">T</Avatar>
            <Text>{lecturer.username}</Text>
          </Stack>
        ))}
      </Group>
    </>
  );
};

export default LecturerList;
