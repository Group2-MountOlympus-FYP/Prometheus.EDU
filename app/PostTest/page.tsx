'use client';

import { useEffect, useState } from 'react';

export default function PostTest() {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // 动态加载 react-quill 只在客户端
    import('react-quill').then((module) => {
      setReactQuill(() => module.default); // 注意这里是函数形式
    });
  }, []);

  return (
    <div>
      <h1>发布文章</h1>

      {/* 等待 ReactQuill 动态导入完成之后再渲染 */}
      {ReactQuill ? (
        <ReactQuill value={value} onChange={setValue} theme="snow" />
      ) : (
        <p>加载编辑器中...</p>
      )}
    </div>
  );
}