'use client'

export function VideoPlayer(){
    return (
        <div>
            <p>Hello</p>
            <video width="640" height="360" controls>
                <source src='/video/test.mp4' type='video/mp4'></source>
                Your browser does not support the video tag.
            </video>
        </div>
    )
}