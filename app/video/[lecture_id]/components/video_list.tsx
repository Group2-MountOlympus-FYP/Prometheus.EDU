import React from 'react';
import {Container, Grid, Card, Text, Title, Stack} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getText } from "./language";

interface VideoInfo {
  id: number;
  title: string;
  video_time: string;
}

interface VideoListProps {
  videoList: VideoInfo[];
}

const VideoList: React.FC<VideoListProps> = ({ videoList }) => {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/video/${id}`);
  };

  return (
    <Container style={{ minHeight: "70vh", maxHeight: "70vh" }}>
      <Title order={2} style={{ marginBottom: '20px' }}>
        {getText('Lecture_List')}
      </Title>

      {videoList.length > 0 ? (
        <div>
          <Stack gap={"sm"} style={{ overflowX: 'auto' }}>
            {videoList.map((video) => (
              <Card
                key={video.id}
                shadow="sm"
                padding="lg"
                style={{ cursor: 'pointer', width:'100%' }}
                onClick={() => handleCardClick(video.id)}
              >
                <Title order={4}>{video.title}</Title>
                <Text size="sm" color="gray">
                  {getText('Lecture_time')}: {video.video_time}
                </Text>
              </Card>
            ))}
          </Stack>
        </div>
      ) : (
        <Text color="red">{getText('No_lecture')}</Text>
      )}
    </Container>
  );
};

export default VideoList;
