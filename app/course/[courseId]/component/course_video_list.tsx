import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Title, Skeleton } from '@mantine/core';
import { getCourseDetailsById } from '@/app/api/Course/router';

interface VideoInfo {
  id: number;
  title: string;
  lastUpdated: string;
}

interface VideoListProps {
  currentLectureId: number;
}

const VideoList: React.FC<VideoListProps> = ({ currentLectureId = 115 }) => {
  const [videoList, setVideoList] = useState<VideoInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [skeletonCount, setSkeletonCount] = useState<number>(3);

  useEffect(() => {
    setLoading(true);
    getCourseDetailsById(currentLectureId)
      .then((data) => {
        console.log('课程列表数据：', data);
        const rawVideos = data.lectures || data.videos || [];
        const filtered = rawVideos.filter((item: any) => Number(item.id) !== currentLectureId);

        setSkeletonCount(Math.min(filtered.length, 3));

        const processedList: VideoInfo[] = filtered.map((item: any) => ({
          id: item.id,
          title: item.name || item.title || '无标题',
          lastUpdated: item.created_at || '未知时间',
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
  }, [currentLectureId]);

  return (
    <Container>
      <Title order={2} style={{ marginBottom: '20px' }}>
        Lecture List
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
        <Grid>
          {videoList.map((video) => (
            <Grid.Col span={12} key={video.id}>
              <Card
                shadow="sm"
                padding="lg"
                style={{
                  cursor: 'default', // 鼠标样式改为默认
                  pointerEvents: 'none', // 彻底禁止点击
                }}
              >
                <Title order={4}>{video.title}</Title>
                <Text size="sm" color="gray">
                  更新时间: {video.lastUpdated}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Text color="red">暂无其他视频</Text>
      )}
    </Container>
  );
};

export default VideoList;
