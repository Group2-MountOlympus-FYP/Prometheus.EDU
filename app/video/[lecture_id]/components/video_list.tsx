import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Title, Skeleton, Button } from '@mantine/core';

// 视频信息接口
interface VideoInfo {
  id: number;
  title: string;
  lastUpdated: string;
}

// 假数据：模拟从 API 获取的多个视频信息
const mockVideoData: VideoInfo[] = [
  { id: 1, title: '如何使用 Mantine 组件库', lastUpdated: '2025-03-24 20:41:05' },
  { id: 2, title: 'React 状态管理基础', lastUpdated: '2025-03-23 19:30:00' },
  { id: 3, title: 'Flask API 快速入门', lastUpdated: '2025-03-22 18:20:15' },
  { id: 4, title: 'TypeScript 编程技巧', lastUpdated: '2025-03-21 17:10:25' },
  { id: 5, title: 'Vue.js 入门教程', lastUpdated: '2025-03-20 16:25:30' },
  { id: 6, title: 'Node.js 异步编程', lastUpdated: '2025-03-19 14:55:45' },
  { id: 7, title: 'Python 数据分析', lastUpdated: '2025-03-18 13:40:00' },
];

// 模拟从 API 获取视频列表
const fetchVideoList = (): Promise<VideoInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVideoData); // 返回假数据
    }, 1000); // 模拟延迟 1.5 秒
  });
};

const VideoList: React.FC = () => {
  const [videoList, setVideoList] = useState<VideoInfo[] | null>(null); // 存储视频列表数据
  const [loading, setLoading] = useState<boolean>(true); // 控制加载状态

  // 获取视频列表
  useEffect(() => {
    fetchVideoList().then((data) => {
      setVideoList(data); // 设置视频列表数据
      setLoading(false);  // 加载完成
    });
  }, []);

  // 点击视频卡片处理函数
  const handleCardClick = (id: number) => {
    alert(`点击了视频 ID: ${id}`);
    // 在这里可以添加更多的处理逻辑，例如跳转到视频详情页
  };

  return (
    <Container>
      <Title order={2} style={{ marginBottom: '20px' }}>
        Lecture List
      </Title>

      {loading ? (
        <Grid>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid.Col span={12} key={index}>
              <Card shadow="sm" padding="lg">
                <Skeleton height={40} animate={true} />
                <Skeleton height={20} animate={true} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <div style={{ height: '300px', overflowY: 'auto' }}>
          <Grid>
            {videoList?.map((video) => (
              <Grid.Col span={12}  key={video.id}>
                <Card
                  shadow="sm"
                  padding="lg"
                  style={{ cursor: 'pointer' }} // 鼠标指针样式
                  onClick={() => handleCardClick(video.id)} // 点击事件
                >
                  <Title order={4}>{video.title}</Title>
                  <Text size="sm" color="gray">{`更新时间: ${video.lastUpdated}`}</Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
};

export default VideoList;
