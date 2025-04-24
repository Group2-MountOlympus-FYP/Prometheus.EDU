"use client";
import React from "react";
import { Avatar, Text, Group, Stack, Title } from "@mantine/core";
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
    </>
  );
};

export default LecturerList;
