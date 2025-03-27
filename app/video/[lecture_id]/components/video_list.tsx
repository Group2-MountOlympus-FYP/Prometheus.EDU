import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text, Title, Skeleton } from '@mantine/core';
import { getCourseDetailsById } from '@/app/api/Course/router'; // ✅ 替换为你的接口路径

// 视频信息接口
interface VideoInfo {
    id: number;
    title: string;
    lastUpdated: string;
}

const VideoList: React.FC = () => {
    const [videoList, setVideoList] = useState<VideoInfo[] | null>(null); // 视频列表
    const [loading, setLoading] = useState<boolean>(true); // 加载状态

    useEffect(() => {
        setLoading(true);
        getCourseDetailsById(115)
            .then((data) => {
                console.log("课程详情：", data);

                // 假设你接口中有一个 `videos` 字段或 `lectures` 字段
                const rawVideos = data.lectures || data.videos || []; // 根据你的字段名调整
                const processedList: VideoInfo[] = rawVideos.map((item: any) => ({
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
    }, []);

    // 点击卡片处理
    const handleCardClick = (id: number) => {
        alert(`点击了视频 ID: ${id}`);
        // 这里可以跳转到 `/video/${id}` 或设置选中状态
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
                                        更新时间: {video.lastUpdated}
                                    </Text>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </div>
            ) : (
                <Text color="red">暂无视频数据</Text>
            )}
        </Container>
    );
};

export default VideoList;
