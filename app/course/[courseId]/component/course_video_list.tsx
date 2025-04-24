'use client';

import React from 'react';
import { Container, Grid, Card, Text, Title, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getText } from "./language";

interface Lecture {
  id: number;
  title: string;
  lastUpdated: string;
}

interface VideoListProps {
  isEnrolled: boolean;
  videos: Lecture[];
}

const VideoList: React.FC<VideoListProps> = ({ isEnrolled, videos }) => {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/video/${id}`);
  };

  return (
    <div>
      <Title order={2} style={{ marginBottom: '20px' }}>
        {getText("Lecture_List")}
      </Title>

      {videos && videos.length > 0 ? (
        <Stack gap={"sm"}>
          {videos.map((video) => (

            <Card
              shadow="sm"
              padding="lg"
              style={{
                cursor: isEnrolled ? 'pointer' : 'not-allowed',
                pointerEvents: isEnrolled ? 'auto' : 'none',
              }}
              onClick={() => {
                if (isEnrolled) {
                  handleCardClick(video.id);
                }
              }}
              key={video.id}
            >
              <Title order={4}>{video.title || getText("no_title")}</Title>
              <Text size="sm" color="gray">
                {getText("Lecture_date")} {new Date(video.lastUpdated).toLocaleDateString() || getText("unknown_time")}
              </Text>
            </Card>

          ))}
        </Stack>
      ) : (
        <Text color="red">{getText("no_videos")}</Text>
      )}
    </div>
  );
};

export default VideoList;
