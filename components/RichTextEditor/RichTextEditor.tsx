'use client'

import { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import './RichTextEditor.css'

export function RichTextEditor() {

    const editor = useEditor({
        extensions: [
          StarterKit,
          Image,
          Mention.configure({
            HTMLAttributes:{
                class: 'mention',
            }
          }),
        ],
        content: '<p>开始写点什么吧...</p>',
    })
        
    const handleImageUpload = async (file: File) => {
        if (!file || !editor) return
    
        // 1. 上传图片，返回 URL
        const url = await uploadImage(file)
    
        // 2. 插入图片
        editor.chain().focus().setImage({ src: url }).run()
    }

    useEffect(() => {
        //防止服务端加载不出编辑器导致出错
        if(!editor) return

        const dom = editor.view.dom

        //处理拖拽图片
        const handleDrop = (event: DragEvent) => {
            event.preventDefault()

            if(!event.dataTransfer || !event.dataTransfer.files.length) return

            Array.from(event.dataTransfer.files).forEach((file) => {
                if (file.type.startsWith('image/')) {
                  handleImageUpload(file)
                }
            })
        }

        const handlePaste = (event: ClipboardEvent) => {
            if (!event.clipboardData || !event.clipboardData.files.length) return

            Array.from(event.clipboardData.files).forEach((file) => {
                if (file.type.startsWith('image/')) {
                handleImageUpload(file)
                }
            })
        }

        dom.addEventListener('drop', handleDrop)
        dom.addEventListener('paste', handlePaste)

        return () => {
            dom.removeEventListener('drop', handleDrop)
            dom.removeEventListener('paste', handlePaste)
        }
    }, [editor])
  
    return (
      <div className="editor-container">
        <h2 className="editor-title">富文本编辑器</h2>
  
        {/* 工具栏 */}
        <div className="editor-toolbar">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>加粗</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>斜体</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}>标题1</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>标题2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>无序列表</button>
        </div>
  
        {/* 编辑器主体 */}
        <EditorContent editor={editor} className="editor-content" />
  
        {/* 底部内容查看 */}
        <div className="editor-output">
          <h3>编辑器 HTML 输出</h3>
          <textarea
            value={editor?.getHTML() || ''}
            readOnly
          />
        </div>
      </div>
    )
}

const uploadImage = async (file: File): Promise<string> => {
    console.log('uploading image')
    //具体逻辑，这个接口最好转移到/api里

    return new Promise((resolve) => {
        setTimeout(() => {
          resolve('https://via.placeholder.com/400x300?text=Uploaded+Image')
        }, 1000)
      })
}