"use client";
import React from "react";
import { Avatar, Text, Group, Stack, Title } from "@mantine/core";

interface Lecturer {
  username: string;
}

interface LecturerListProps {
  lecturers: Lecturer[];
}

const LecturerList: React.FC<LecturerListProps> = ({ lecturers }) => {
  return (
    <>
      <Title order={3} mt="xl" mb="md">
        Course Lecturers
      </Title>
      <Group wrap="wrap" gap="xl">
        {lecturers.map((lecturer, index) => (
          <Stack align="center" key={index} gap={4}>
            <Avatar radius="xl">{lecturer.username?.[0]?.toUpperCase() || "T"}</Avatar>
            <Text>{lecturer.username}</Text>
          </Stack>
        ))}
      </Group>
    </>
  );
};

export default LecturerList;
