'use client'
import React, { useState, useEffect } from 'react';
import { GetVideo } from '@/app/api/Video/router';

export function VideoPlayer(){
    const [videoUrl, setVideoUrl] = useState('');

    const getTestVideo = async () => {
        const response = await GetVideo('test.mp4')
        console.log(response)
    }
    return (
        <div>
            <video controls width="100%">
            <source src='http://127.0.0.1:5000/video/test.mp4' type="video/mp4" />
            Your browser does not support the video tag.
            </video>
            <button onClick={getTestVideo}>Get Testing Video</button>
        </div>
    )
}