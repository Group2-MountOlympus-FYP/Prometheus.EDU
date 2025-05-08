"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Text, Group, Stack, Title, Container } from "@mantine/core";
import { getText } from "./language";

interface Lecturer {
  username: string;
  avatar?: string;
}

interface LecturerListProps {
  lecturers: Lecturer[];
}

export function LectureListForCourseDetail(props: LecturerListProps) {
  const router = useRouter();

  return (
    <div>
      <Group gap="xl" justify="space-between">
        {props.lecturers.map((lecturer, index) => {
          const name = lecturer.username || getText("unknown_user");
          const avatarSrc = lecturer.avatar || undefined;

          const toAuthorProfile = () => {
            if (lecturer.username) {
              router.push(`/Profile/${lecturer.username}`);
            }
          };

          return (
            <Group align="center" key={index} gap={'md'}>
              <Avatar
                radius="xl"
                src={avatarSrc}
                size={50}
                onClick={toAuthorProfile}
                style={{ cursor: "pointer" }}
              >
                {name[0]?.toUpperCase() || "?"}
              </Avatar>
              <Text>{name}</Text>
            </Group>
          );
        })}
      </Group>
    </div>
  );
}
