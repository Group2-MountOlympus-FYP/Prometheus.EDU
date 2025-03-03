'use client'
import React, { useState, useEffect } from 'react';

export function VideoPlayer(props:any){
    const [videoUrl, setVideoUrl] = useState('');

    return (
        <div>
            <video controls width="80%">
            <source src='http://127.0.0.1:5000/video/test.mp4' type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
    )
}