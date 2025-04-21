import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Title, Skeleton } from '@mantine/core';
import { getCourseDetailsById } from '@/app/api/Course/router';
import { useRouter } from 'next/navigation';
import { getText } from "./language";

interface VideoInfo {
  id: number;
  title: string;
  video_time: string;
}

interface VideoListProps {
  currentCourseId: number;
  currentLectureId: number;
}


const VideoList: React.FC<VideoListProps> = ({currentCourseId, currentLectureId  }) => {
  const router = useRouter();
  const [videoList, setVideoList] = useState<VideoInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonCount, setSkeletonCount] = useState<number>(3);

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(currentCourseId)
      .then((data) => {
        const rawVideos = data.lectures || data.videos || [];
        const filtered = rawVideos.filter((item: any) => Number(item.id) !== currentLectureId); // 只排除当前 lecture

        setSkeletonCount(Math.min(filtered.length, 3));
        const processedList: VideoInfo[] = filtered.map((item: any) => ({
          id: item.id,
          title: item.name || item.title || '无标题',
          video_time: item.video_time || '未知时长',
        }));

        setVideoList(processedList);
      })
      .catch((err) => {
        console.error("出错了：", err);
        setVideoList(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentCourseId, currentLectureId]);


  const handleCardClick = (id: number) => {
    router.push(`/video/${id}`);
  };

  return (
    <Container>
      <Title order={2} style={{ marginBottom: '20px' }}>
        {getText('Lecture_List')}
      </Title>

      {loading ? (
        <Grid>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Grid.Col span={12} key={index}>
              <Card shadow="sm" padding="lg">
                <Skeleton height={30} animate />
                <Skeleton height={20} mt={10} animate />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : videoList && videoList.length > 0 ? (
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
        <Text color="red"> {getText('No_lecture')}</Text>
      )}
    </Container>
  );
};

export default VideoList;
