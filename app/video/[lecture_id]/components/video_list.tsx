import React from 'react';
import { Container, Grid, Card, Text, Title, Stack, ScrollArea } from '@mantine/core';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getText } from "./language";
import classes from './lecture.module.css';

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
    <Container style={{ minHeight: "56vh", maxHeight: "56vh", border: '1px solid black', borderRadius:'5px' }}>
      <Title order={2} style={{ marginBottom: '15px' }}>
        {getText('Lecture_List')}
      </Title>

      {videoList.length > 0 ? (
        <ScrollArea h={'45vh'} style={{paddingRight: '10px'}}>
          <Stack gap={"sm"} style={{ overflowX: 'auto' }}>
            {videoList.map((video) => (
              <Card
                key={video.id}
                padding="lg"
                className={classes.videoItem}
                onClick={() => handleCardClick(video.id)}
              >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title order={4} fw={500}>{video.title}</Title>
                  <Text size="sm" color="gray">
                    {getText('Lecture_time')}: {video.video_time}
                  </Text>
                </div>
                <FaPlay style={{ fontSize: '20px', color: '#777CB9' }} /> {/* 播放图标 */}
              </div>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      ) : (
        <Text color="red">{getText('No_lecture')}</Text>
      )}
    </Container>
  );
};

export default VideoList;
