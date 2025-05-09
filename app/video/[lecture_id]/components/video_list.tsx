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

  // 按照 id 升序排列（假设 id 小的是早期课程）
  const sortedList = [...videoList].sort((a, b) => a.id - b.id);

  return (
    <Container style={{ minHeight: "56vh", maxHeight: "56vh" }}>
      <Title order={2} style={{ marginBottom: '15px' }}>
        {getText('Lecture_List')}
      </Title>

      {sortedList.length > 0 ? (
        <ScrollArea h={'45vh'} style={{paddingRight: '10px', paddingLeft:'10px', paddingTop:'15px', paddingBottom:'15px', background:'#DEE0EF', borderRadius:'5px'}}>
          <Stack gap={"sm"} style={{ overflowX: 'auto' }}>
            {sortedList.map((video) => (
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
                  <FaPlay style={{ fontSize: '20px', color: '#777CB9' }} />
                </div>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      ) : (
        <Text c="#777CB9">{getText('No_lecture')}</Text>
      )}
    </Container>
  );
};


export default VideoList;
