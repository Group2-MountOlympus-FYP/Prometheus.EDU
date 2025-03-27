import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Skeleton } from '@mantine/core';

// 视频简介的数据接口
interface VideoIntro {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

// 假数据：模拟从 API 获取的多个视频简介
const mockVideoData: VideoIntro[] = [
  {
    id: 1,
    title: '如何使用 Mantine 组件库',
    description: '主要讲了如何在 React 项目中使用 Mantine 组件库的简短介绍。',
    videoUrl: 'https://www.example.com/video1.mp4',
  },
  {
    id: 2,
    title: 'React 状态管理基础',
    description: '在这个视频中，我们将深入了解 React 状态管理和相关概念。',
    videoUrl: 'https://www.example.com/video2.mp4',
  },
  {
    id: 3,
    title: 'Flask API 快速入门',
    description: '学习如何使用 Flask 构建简单的 RESTful API。',
    videoUrl: 'https://www.example.com/video3.mp4',
  },
];

interface LectureIntroductionProps {
  videoId: number; // 接收 videoId 作为参数
}

const VideoPage: React.FC = () => {
  const [videoId, setVideoId] = useState(1); // 初始化 videoId 为 1

  const LectureIntroduction: React.FC<LectureIntroductionProps> = ({ videoId }) => {
    const [videoData, setVideoData] = useState<VideoIntro | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      // 模拟 API 调用，获取对应 videoId 的视频简介
      console.log('Looking for video with ID:', videoId); // 调试输出
      // 只显示 videoId 为 1 的视频简介
      const video = mockVideoData.find((video) => video.id === 1); // 强制筛选出 videoId 1
      if (video) {
        setVideoData(video); // 设置视频数据
      } else {
        console.log('No video found with this ID'); // 如果没有找到视频，输出日志
      }
      setLoading(false); // 加载完成
    }, [videoId]); // 依赖于 videoId，当 videoId 变化时重新加载数据

    return (
      <Container size="lg" style={{ paddingTop: '20px' }}>
        <Title order={1} style={{ textAlign: 'left', marginBottom: '20px' }}>
          Lecture Overview
        </Title>

        {loading ? (
          <Skeleton height="50px" width="100%" animate={true} />
        ) : videoData ? (
          <div>
            <Text size="md" style={{ marginBottom: '20px' }}>
              {videoData.description}
            </Text>

          </div>
        ) : (
          <Text size="md" color="red">
            视频信息未找到！
          </Text>
        )}
      </Container>
    );
  };

  return <LectureIntroduction videoId={videoId} />;
};

export default VideoPage;
