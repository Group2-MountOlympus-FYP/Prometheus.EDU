import React from 'react';
import { Container, Grid, Card, Text, Title } from '@mantine/core';
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
    <Container>
      <Title order={2} style={{ marginBottom: '20px' }}>
        {getText('Lecture_List')}
      </Title>

      {videoList.length > 0 ? (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Grid>
            {videoList.map((video) => (
              <Grid.Col span={12} key={video.id}>
                <Card
                  shadow="sm"
                  padding="lg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(video.id)}
                >
                  <Title order={4}>{video.title}</Title>
                  <Text size="sm" color="gray">
                    {getText('Lecture_time')}: {video.video_time}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      ) : (
        <Text color="red">{getText('No_lecture')}</Text>
      )}
    </Container>
  );
};

export default VideoList;
