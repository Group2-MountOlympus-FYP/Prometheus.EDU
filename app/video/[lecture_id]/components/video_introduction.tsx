import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Skeleton } from '@mantine/core';
import {getLectureDetailsById} from "@/app/api/Lecture/router";

interface VideoInfo {
    description: string;
    videoId: string;
}

// 接受 lectureId 作为 props（默认是 120）
interface VideoInfoComponentProps {
    lectureId?: number;
}

const VideoInfoComponent: React.FC<VideoInfoComponentProps> = ({ lectureId = 120 }) => {
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

    useEffect(() => {
      getLectureDetailsById(lectureId, 1, 10)
            .then((data) => {
                console.log("返回数据：", data);
                const info: VideoInfo = {
                    description : data.description || '无标题',
                    videoId: String(data.id),

                };
                setVideoInfo(info); // ✅ 填到状态中
            })
            .catch((err) => {
                console.error("出错了:", err);
            });
    }, [lectureId]);

  return (
      <Container size="lg" style={{ paddingTop: '20px' }}>
        <Title order={1} style={{ textAlign: 'left', marginBottom: '20px' }}>
          Lecture Overview
        </Title>

          <div>
            <Text size="md" style={{ marginBottom: '20px' }}>
               {videoInfo ? videoInfo.description : '加载中...'}
            </Text>

          </div>

      </Container>
    );
};

export default VideoInfoComponent;
