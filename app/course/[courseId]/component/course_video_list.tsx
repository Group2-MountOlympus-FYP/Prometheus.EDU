'use client';

import React from 'react';
import { Container, Grid, Card, Text, Title } from '@mantine/core';
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
    <Container>
      <Title order={2} style={{ marginBottom: '20px' }}>
        {getText("Lecture_List")}
      </Title>

      {videos && videos.length > 0 ? (
        <Grid>
          {videos.map((video) => (
            <Grid.Col span={12} key={video.id}>
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
              >
                <Title order={4}>{video.title || getText("no_title")}</Title>
                <Text size="sm" color="gray">
                  {getText("Lecture_date")} {video.lastUpdated || getText("unknown_time")}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Text color="red">{getText("no_videos")}</Text>
      )}
    </Container>
  );
};

export default VideoList;
