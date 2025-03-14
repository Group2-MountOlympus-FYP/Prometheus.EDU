'use client'

import { useState } from "react"
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill';

const RichTextEditor = () => {
    const [content, setContent] = useState('');

    const handlePost = () => {
        console.log(content); // 富文本HTML
        // 把 content 发送给后端保存
    };

    return (
        <div>
        <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="写点什么吧..."
        />
        <button onClick={handlePost}>发布</button>
        </div>
    );
}

export default RichTextEditor