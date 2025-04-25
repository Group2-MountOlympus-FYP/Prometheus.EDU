"use client";
import React from "react";
import { Avatar, Text, Group, Stack, Title, Container } from "@mantine/core";
import { getText } from "./language";

interface Lecturer {
  username: string;
  avatar?: string;
}

interface LecturerListProps {
  lecturers: Lecturer[];
}

const LecturerList: React.FC<LecturerListProps> = ({ lecturers }) => {
  return (
    <>
    <Container style={{ minWidth: "25vw", maxWidth: "25vw" }}>
      <Title order={3} fw={500} style={{ marginBottom: '25px' }}>
                {getText('Instructor_List')}
      </Title>
      <Group wrap="wrap" gap="xl">
        {lecturers.map((lecturer, index) => {
          const name = lecturer.username || getText("unknown_user");
          const avatarSrc = lecturer.avatar || undefined;
          return (
            <Stack align="center" key={index} gap={4}>
              <Avatar radius="xl" src={avatarSrc}>
                {name[0]?.toUpperCase() || "?"}
              </Avatar>
              <Text>{name}</Text>
            </Stack>
          );
        })}
      </Group>
      </Container>
    </>
  );
};

export function LectureListForCourseDetail(props: LecturerListProps){
  return (
      <div>
        <Group gap="xl" justify={"space-between"}>
          {props.lecturers.map((lecturer, index) => {
            const name = lecturer.username || getText("unknown_user");
            const avatarSrc = lecturer.avatar || undefined;
            return (
                <Stack align="center" key={index} gap={4}>
                  <Avatar radius="xl" src={avatarSrc}>
                    {name[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Text>{name}</Text>
                </Stack>
            );
          })}
        </Group>
      </div>
  )
}

export default LecturerList;

