'use client'
import { useEffect, useState, useRef } from "react"
import { useDisclosure } from "@mantine/hooks";
import { Grid, Skeleton, Container, Button, Tabs, Pagination } from '@mantine/core';
import { WritingPostPanel } from "@/components/WritingPost/WritingPostPanel";
import { PostsOverview } from "@/components/PostsOverview/PostsOverview";
import { PostsWithPagination } from "@/components/PostsOverview/PostsWithPagination";
import './page.css'

interface videoProps{
    url: string,
}

export default function Course(props:videoProps){
    //用于判断组件是否离开屏幕
    const videoRef = useRef<HTMLDivElement>(null)
    const [isVideoLeaveWindow, setIsVideoLeaveWindow] = useState(false)
    //控制发帖按钮
    const [opened, {open, close}] = useDisclosure(false)

    const [titleLoading, setTitleLoading] = useState(true)
    const [videoSelectorLoading, setVideoSelectorLoading] = useState(true)
    const [postsLoading, setPostsLoading] = useState(false)

    useEffect(() => {
        //为视频挂上ref
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                // 如果 entry.isIntersecting 为 false，说明目标元素离开视口了
                if(entry.isIntersecting){
                    //console.log('元素进入视口或回来了');
                    setIsVideoLeaveWindow(false)
                }
                else{
                    //console.log('元素离开视口，滚过去了');
                    setIsVideoLeaveWindow(true)
                }
            },
            {
                root: null, // 视口
                threshold: 0.5, // 只要有交叉就触发
            }
        )
        if(videoRef.current){
            observer.observe(videoRef.current)
        }
        return () => {
            if(videoRef.current){
                observer.unobserve(videoRef.current)
            }
        }
    }, [])

    return (
        <Container size={"fluid"}>
        <div style={{width:'100%', display:'block'}}>
            <div hidden={titleLoading}>
                <span style={{display:'block'}} className="video-title">Title</span>
                <span style={{display:'block'}}>subtitle and informations</span>
            </div>
            <Skeleton animate={true} height={"100px"} hidden={!titleLoading}></Skeleton>
        </div>
        
        <Grid className="video-grid" ref={videoRef}>
            <Grid.Col span={8}>
                <VideoPlayer></VideoPlayer>
                <div>
                    <p>This is the description of the video</p>
                </div>
            </Grid.Col>
            <Grid.Col span={4}>
                <div>
                    <VideoSelector onLoadComplete={() => setVideoSelectorLoading(false)}></VideoSelector>
                </div>
                <Skeleton radius="md" animate={true} height="300px" hidden={!videoSelectorLoading}></Skeleton>
            </Grid.Col>
        </Grid>
        <div>
            <div hidden={postsLoading}>
                <Tabs color='#3C4077' variant="pills" defaultValue={"posts"} className="tabs">
                    <Tabs.List className="tabs-list">
                        <Tabs.Tab value="posts">Posts</Tabs.Tab>
                        <Tabs.Tab value="Matrials">Materials</Tabs.Tab>
                        <Tabs.Tab value="Assignments">Assignments</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="posts">
                        <PostsWithPagination/>
                    </Tabs.Panel>
                    <Tabs.Panel value="Matrials">
                        Materials
                    </Tabs.Panel>
                    <Tabs.Panel value="Assignments">
                        Assignments
                    </Tabs.Panel>
                </Tabs>
                <div>
                    <WritingPostPanel opened={opened} onClose={close}></WritingPostPanel>
                    <Button onClick={open} id={`${isVideoLeaveWindow ? "normal" : "right-corner"}`} className="post-button">Open to write post</Button>
                </div>
            </div>
            <Skeleton height={'500px'} animate={true} hidden={!postsLoading}></Skeleton>
        </div>
        </Container>
    )
}

const VideoSelector = ( {onLoadComplete}: {onLoadComplete: () => void } ) => {
    useEffect(() => {
        //加载完成
        //onLoadComplete()
    })
    return (
        <div>

        </div>
    )
}

type VideoTypes = 'video/mp4'
interface videoPlayerProps{
    
}

//视频播放组件
function VideoPlayer(props:videoPlayerProps){
    const baseURL = 'http://127.0.0.1:5000/video/'
    const [videoUrl, setVideoUrl] = useState('test.mp4');
    const [videoType, setVideoType] = useState<VideoTypes>('video/mp4')

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <video controls width="100%" style={{margin:'auto', textAlign:'center'}}>
            <source src={baseURL+videoUrl} type={videoType} />
            Your browser does not support the video tag.
            </video>
        </div>
    )
}