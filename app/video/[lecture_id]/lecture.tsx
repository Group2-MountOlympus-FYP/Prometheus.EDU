'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {Grid, Container, Button, Tabs, Text, Title, Stack} from '@mantine/core';
import { WritingAssignmentPanel, WritingPostPanel } from '@/components/WritingPost/WritingPostPanel';
import { PostsWithPagination } from '@/components/PostsOverview/PostsWithPagination';
import './page.css';
import VideoList from './components/video_list';
import VideoIntro from './components/video_introduction';
import Material from '@/app/video/[lecture_id]/components/material';
import LecterList from '../../course/[courseId]/component/teachers_list'
import { getLectureDetailsById } from '@/app/api/Lecture/router';
import { getCourseDetailsById } from '@/app/api/Course/router';
import { publishPost } from "@/app/api/Posts/router"
import { getText } from "./components/language";
import { getUserInfo } from '@/app/api/General';
import { Assignments } from '@/components/PostsOverview/Assignments';
import { notifications } from "@mantine/notifications"
import { format } from "date-fns";
import { LoadingContext } from "@/components/Contexts/LoadingContext";
import { IconMessageCircle, IconPaperclip, IconBrandAsana } from '@tabler/icons-react';

interface LectureProps {
  lectureId: number;
}
interface VideoInfo {
  id: number;
  title: string;
  video_time: string;
}


export default function Lecture({ lectureId }: LectureProps) {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoLeaveWindow, setIsVideoLeaveWindow] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [lectureData, setLectureData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [assignmentWriteOpened, { open: openA, close: closeA }] = useDisclosure(false)

  const [videoList, setVideoList] = useState<VideoInfo[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);

  const handlePostSubmit = async ({
                                    title,
                                    content,
                                    mentionList,
                                  }: {
    title: string;
    content: string;
    mentionList: any[];
  }) => {
    const containsAthenaMention = (htmlContent: string): boolean => {
      const mentionRegex = /<span[^>]*data-type="mention"[^>]*data-id="-1"[^>]*>/g
      return mentionRegex.test(htmlContent)
    }

    let tags: number[] = []
    if (containsAthenaMention(content)) {
      tags = [1]
    }

    try {
      const response = await publishPost(title, content, tags, lectureId, mentionList)
      if (response.ok) {
        notifications.show({
          message: getText("post_success")
        })
        close() // 关闭 modal
      }
    } catch (err) {
      notifications.show({
        message: 'Post fail',
        color: 'red'
      })
      console.error(err)
    }
  }

  const handleAssignmentSubmit = async ({
                                          title,
                                          content,
                                          mentionList
                                        }: {
    title: string;
    content: string;
    mentionList: any[];
  }) => {
    const tags = [4]; // 代表“作业”的标签

    try {
      const response = await publishPost(title, content, tags, lectureId, mentionList);
      if (response.ok) {
        notifications.show({
          message: "Assignment release successful",
        });
        closeA(); // 关闭弹窗
      }
    } catch (err) {
      notifications.show({
        message: "Assignment release failed",
        color: "red",
      });
      console.error("作业发布失败:", err);
    }
  };



  useEffect(() => {
    setIsLoading(true)
    getLectureDetailsById(lectureId, 1, 10)
      .then((lectureRes) => {
        if (!lectureRes || lectureRes.detail === 'Course not found') {
          setError(true);
        } else {
          setLectureData(lectureRes);
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

          setIsLoading(false)
        });
      })
      .catch(() => {setError(true);setIsLoading(false);});
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

      <Container size={"xl"}>
        <Stack gap={"sm"}>
          <Title>{lectureData.name}</Title>
          {/* {getText('Lecture_name')}: */}
          <Text id={"video-release-date"}>
            {getText('Lecture_date')}: {format(new Date(lectureData.created_at), 'yyyy-MM-dd')}
          </Text>
        </Stack>

        <Grid className="video-grid" ref={videoRef}>
          <Grid.Col span={8}>
            <VideoPlayer videoUrl={lectureData.video_url} />
            <VideoIntro lectureData={lectureData} />
          </Grid.Col>
          <Grid.Col span={4}>
          <Container style={{ minHeight: "70vh" }}>
            <VideoList videoList={videoList} />
            <div className="lecture_list_div">
              <LecterList lecturers={lecturers} />
            </div>
          </Container>

          </Grid.Col>
        </Grid>
      </Container>

      <Container size={"xl"} style={{ paddingLeft: "0" }}>
      <Stack gap="md">
        <Tabs
          color="#3C4077"
          variant="pills"
          defaultValue="posts"
          classNames={{ tab: 'tabs' }}
          value={activeTab}
          onChange={(val) => val && setActiveTab(val)}
        >
          <Tabs.List className="tabs-list">
            <Tabs.Tab value="posts" leftSection={<IconMessageCircle size={18}/>}>{getText('posts')}</Tabs.Tab>
            <Tabs.Tab value="Matrials" leftSection={<IconPaperclip size={18}/>}>{getText('materials')}</Tabs.Tab>
            <Tabs.Tab value="Assignments" leftSection={<IconBrandAsana size={18}/>}>{getText('assignments')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts">
            <PostsWithPagination lecture_id={lectureId} lecture_data={lectureData} />
          </Tabs.Panel>
          <Tabs.Panel value="Matrials">
            <Material lectureData={lectureData} />
          </Tabs.Panel>
          <Tabs.Panel value="Assignments">
            <Assignments assignments={lectureData.posts}></Assignments>
          </Tabs.Panel>
        </Tabs>

        {activeTab === 'posts' && (
          <div className="post-panel">
            <WritingPostPanel
              opened={opened}
              onClose={close}
              lecture_id={lectureId}
              onSubmit={handlePostSubmit}
            />

            <Button size="lg"
              onClick={open}
              id={isVideoLeaveWindow ? 'normal' : 'right-corner'}
              className="post-button"
            >
              {getText('write_post')}
            </Button>
          </div>
        )}
        {
          activeTab === 'Assignments' && getUserInfo()?.userType === "TEACHER" && lectureData.teacher.username == getUserInfo()?.username && (
            <div className="post-panel">
              <Button
                color={"#3C4077"}
                onClick={openA}
              >{getText("write_assignment")}</Button>

              <WritingAssignmentPanel
                opened={assignmentWriteOpened}
                onClose={closeA}
                lecture_id={lectureId}
                onSubmit={handleAssignmentSubmit}
              />

            </div>
        )}
      </Stack>
      </Container>

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
    <div style={{ display: 'flex', justifyContent: 'center'}}>
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
          maxHeight: '56vh',
        }}
      >
        <source src={videoUrl} type={videoType} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
