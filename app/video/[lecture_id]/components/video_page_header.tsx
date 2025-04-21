import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Text } from '@mantine/core';
import {getLectureDetailsById} from "@/app/api/Lecture/router";
import { format } from 'date-fns';
import { getText } from "./language";


// 接口类型定义
interface VideoInfo {
    name: string;
    videoId: string;
    lastUpdated: string;
}

// 接受 lectureId 作为 props（默认是 120）
interface VideoHeaderProps {
    lectureId: number;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ lectureId }) => {
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

    useEffect(() => {
        getLectureDetailsById(lectureId, 1, 10)
            .then((data) => {
                console.log("返回数据：", data);
                const info: VideoInfo = {
                    name: data.name || '无标题',
                    videoId: String(data.id),
                    lastUpdated: data.created_at || '未知时间',
                };
                setVideoInfo(info); // ✅ 填到状态中
            })
            .catch((err) => {
                console.error("出错了:", err);
            });
    }, [lectureId]);

    return (
        <Container>
            <Grid>
                <Grid.Col span={6}>
                    <Card>
                        <Text>
                            {getText('Lecture_name')} {videoInfo?.videoId}: {videoInfo ? videoInfo.name : getText('Loading')}
                        </Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card>

                        <Text>
                            {videoInfo
                              ? `${getText('Lecture_date')}: ${format(new Date(videoInfo.lastUpdated), 'yyyy-MM-dd')}`
                              : getText('Loading')}
                        </Text>


                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default VideoHeader;
