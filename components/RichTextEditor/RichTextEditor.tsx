'use client'

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import './RichTextEditor.css'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

interface UserItem{
  id: string,
  label: string,
}

const users: UserItem[] = [
  { id: '1', label: '张三' },
  { id: '2', label: '李四' },
  { id: '3', label: '王五' },
]

export function RichTextEditor() {

    const editor = useEditor({
        extensions: [
          StarterKit,
          Image,
          BulletList, OrderedList, ListItem, Paragraph,
          Mention.configure({
            HTMLAttributes:{
                class: 'mention',
            },
            renderHTML({node}){
              return `👤 ${node.attrs.label}`
            },
            suggestion: suggestion,
            renderText({ node }){
              return  `👤 ${node.attrs.label}`
            },
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
  
        {/* 工具栏 */}
        <div className="editor-toolbar">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}>加粗</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}>斜体</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}>标题1</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>标题2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}>无序列表</button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}>Toggle ordered list</button>
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


const suggestion = {
  char: '@',
  items: ({ query }: { query: string }) => {
    //异步请求
    return users
      .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
  },
  render: () => {
    let component: HTMLDivElement
    let popup: TippyInstance

    return {
      onStart: (props: any) => {
        component = document.createElement('div')
        component.className = 'mention-list'
        
        props.items.forEach((item: any, index: number) => {
          const option = document.createElement('div')
          option.className = 'mention-item'
          option.textContent = item.label

          option.addEventListener('click', () => {
            props.command(item)
          })

          component.appendChild(option)
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })[0]
      },

      onUpdate(props: any) {
        while (component.firstChild) {
          component.removeChild(component.firstChild)
        }

        props.items.forEach((item: any) => {
          const option = document.createElement('div')
          option.className = 'mention-item'
          option.textContent = item.label

          option.addEventListener('click', () => {
            props.command(item)
          })

          component.appendChild(option)
        })

        popup.setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup?.hide()
          return true
        }
        return false
      },

      onExit() {
        popup?.destroy()
      },
    }
  },
}