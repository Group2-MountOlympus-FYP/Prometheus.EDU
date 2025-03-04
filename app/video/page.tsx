'use client'
import { useEffect, useState } from "react"
import { Grid, Skeleton, Container } from '@mantine/core';
import './page.css'

interface videoProps{
    url: string,
}

export default function video(props:videoProps){
    const [titleLoading, setTitleLoading] = useState(true)
    const [videoSelectorLoading, setVideoSelectorLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(true)

    useEffect(() => {

    })

    return (
        <Container size={"fluid"}>
        <div style={{width:'100%', display:'block'}}>
            <div hidden={titleLoading}>
                <span style={{display:'block'}} className="video-title">Title</span>
                <span style={{display:'block'}}>subtitle and informations</span>
            </div>
            <Skeleton animate={true} height={"100px"} hidden={!titleLoading}></Skeleton>
        </div>
        <Grid className="video-grid">
            <Grid.Col span={8}>
                <VideoPlayer></VideoPlayer>
            </Grid.Col>
            <Grid.Col span={4}>
                <div>
                    <VideoSelector onLoadComplete={() => setVideoSelectorLoading(false)}></VideoSelector>
                </div>
                <Skeleton radius="md" animate={true} height="300px" hidden={!videoSelectorLoading}></Skeleton>
            </Grid.Col>
        </Grid>
        <div>
            <span>
                comment and posts
            </span>
            <Skeleton height={'500px'} animate={true} hidden={!commentLoading}></Skeleton>
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
            <video controls width="80%" style={{margin:'auto', textAlign:'center'}}>
            <source src={baseURL+videoUrl} type={videoType} />
            Your browser does not support the video tag.
            </video>
        </div>
    )
}