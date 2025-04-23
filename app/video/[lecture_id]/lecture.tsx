'use client';

import { useEffect, useState, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Grid, Skeleton, Container, Button, Tabs } from '@mantine/core';
import { WritingPostPanel } from '@/components/WritingPost/WritingPostPanel';
import { PostsWithPagination } from '@/components/PostsOverview/PostsWithPagination';

import './page.css';
import VideoHeader from './components/video_page_header';
import VideoList from './components/video_list';
import VideoIntro from './components/video_introduction';
import Material from '@/app/video/[lecture_id]/components/material';
import LecterList from '../../course/[courseId]/component/teachers_list'
import { getLectureDetailsById } from '@/app/api/Lecture/router';
import { getCourseDetailsById } from '@/app/api/Course/router';
import { getText } from "./components/language";

interface LectureProps {
  lectureId: number;
}
interface VideoInfo {
  id: number;
  title: string;
  video_time: string;
}


export default function Lecture({ lectureId }: LectureProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoLeaveWindow, setIsVideoLeaveWindow] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [lectureData, setLectureData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  const [videoList, setVideoList] = useState<VideoInfo[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);

  useEffect(() => {
    getLectureDetailsById(lectureId, 1, 10)
      .then((lectureRes) => {
        if (!lectureRes || lectureRes.detail === 'Course not found') {
          setError(true);
          return;
        }
        setLectureData(lectureRes);

        // 额外请求该课程的所有 lectures
        getCourseDetailsById(lectureRes.course).then((courseRes) => {
          const rawVideos = courseRes.lectures || courseRes.videos || [];
          const filtered = rawVideos.filter((item: any) => Number(item.id) !== lectureId);
          const processedList: VideoInfo[] = filtered.map((item: any) => ({
            id: item.id,
            title: item.name || item.title || '无标题',
            video_time: item.video_time || '未知时长',
          }));

          setVideoList(processedList);
          setLecturers(courseRes.teachers || []); // 👈 设置老师列表
        });
      })
      .catch(() => setError(true));
  }, [lectureId]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVideoLeaveWindow(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>❌ {getText('Lecture_404')}</h1>
        <p>{getText('Lecture_exist')}</p>
      </div>
    );
  }

  if (!lectureData) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>{getText('Loading')}</div>;
  }

  return (
    <Container className="video-container" size="fluid">
      <VideoHeader lectureData={lectureData} />

      <Grid className="video-grid" ref={videoRef}>
        <Grid.Col span={8}>
          <VideoPlayer videoUrl={lectureData.video_url} />
          <VideoIntro lectureData={lectureData} />
        </Grid.Col>
        <Grid.Col span={4}>
          <VideoList videoList={videoList} />
          <LecterList lecturers={lecturers}/>

        </Grid.Col>
      </Grid>

      <div hidden={postsLoading}>
        <Tabs
          color="#3C4077"
          variant="pills"
          defaultValue="posts"
          className="tabs"
          value={activeTab}
          onChange={(val) => val && setActiveTab(val)}
        >
          <Tabs.List className="tabs-list">
            <Tabs.Tab value="posts">{getText('post')}</Tabs.Tab>
            <Tabs.Tab value="Matrials">{getText('material')}</Tabs.Tab>
            <Tabs.Tab value="Assignments">{getText('assignment')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts">
            <PostsWithPagination lecture_id={lectureId} />
          </Tabs.Panel>
          <Tabs.Panel value="Matrials">
            <Material lectureData={lectureData} />
          </Tabs.Panel>
          <Tabs.Panel value="Assignments">Assignments</Tabs.Panel>
        </Tabs>

        {activeTab === 'posts' && (
          <div className="post-panel">
            <WritingPostPanel opened={opened} onClose={close} lecture_id={lectureId} />
            <Button
              onClick={open}
              id={isVideoLeaveWindow ? 'normal' : 'right-corner'}
              className="post-button"
            >
              {getText('write_post')}
            </Button>
          </div>
        )}
      </div>

      <Skeleton height={'500px'} animate={true} hidden={!postsLoading} />
    </Container>
  );
}

type VideoTypes = 'video/mp4' | 'video/quicktime';

interface VideoPlayerProps {
  videoUrl: string;
}

function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoType, setVideoType] = useState<VideoTypes>('video/mp4'); // 默认 mp4 更稳

  const handleError = () => {
    const error = videoRef.current?.error;
    if (error) {
      const message =
        {
          1: '视频加载被用户中止',
          2: '网络错误',
          3: '解码失败（格式可能不支持）',
          4: '视频格式不支持或服务器响应错误',
        }[error.code] || '未知错误';
      console.error('[VIDEO ERROR]', message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <video
        ref={videoRef}
        controls
        width="100%"
        onError={handleError}
        style={{
          margin: 'auto',
          textAlign: 'center',
          backgroundColor: 'black',
          minHeight: '240px',
        }}
      >
        <source src={videoUrl} type={videoType} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
