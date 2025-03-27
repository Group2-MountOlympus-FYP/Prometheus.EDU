import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Title } from '@mantine/core';

// 接口类型定义
interface VideoInfo {
  title: string;
  videoId: string;
  lastUpdated: string;
}

// 假数据
const mockData: VideoInfo = {
  title: 'Introduce React Hooks',
  videoId:'1',
  lastUpdated: '2025-03-24 20:41:05',
};

// 模拟获取视频信息的 API
const fetchVideoInfo = (): Promise<VideoInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });
};

const VideoInfoComponent: React.FC = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  useEffect(() => {
    // 模拟请求数据
    fetchVideoInfo().then((data) => setVideoInfo(data));
  }, []);

  return (
    <Container>
      <Grid>
        <Grid.Col span={6}>
          <Card>

            <Text>Lecture {videoInfo?.videoId}: {videoInfo ? videoInfo.title : ''}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card >

            <Text>{videoInfo ? videoInfo.lastUpdated : '加载中...'}</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default VideoInfoComponent;
