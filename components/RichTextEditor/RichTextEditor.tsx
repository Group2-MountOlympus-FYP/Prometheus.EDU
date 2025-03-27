'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from '@tiptap/extension-underline'
import './RichTextEditor.css'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import Blockquote from "@tiptap/extension-blockquote";
import { TfiList } from "react-icons/tfi";
import { TfiListOl } from "react-icons/tfi";
import CodeBlock from "@tiptap/extension-code-block";

interface UserItem{
  id: string,
  label: string,
}

const users: UserItem[] = [
  { id: '1', label: '张三' },
  { id: '2', label: '李四' },
  { id: '3', label: '王五' },
]

export const RichTextEditor = forwardRef((props, ref) => {

    const editor = useEditor({
        extensions: [
          StarterKit,
          Image,
          BulletList, OrderedList, ListItem, Paragraph, Underline, 
          CodeBlock.configure({
            HTMLAttributes:{
              class: 'code-block'
            }
          }),
          Blockquote.configure({
            HTMLAttributes:{
              class: 'quote'
            }
          }),
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

    //手动插入mention并且@Athena
    const mentionAthena = () => {
      editor?.commands.insertContent({
        type:'mention',
        attrs:{
          label: 'Athena',
          id: -1
        }
      })
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

    useImperativeHandle(ref, () => ({
      getText: () => {
        return editor?.getHTML()
      }
    }))
  
    return (
      <div className="editor-container">
  
        {/* 工具栏 */}
        <div className="editor-toolbar">
          <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive('blockquote') ? 'is-active' : ''}><b>"</b></button>
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}><b>B</b></button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}><i>I</i></button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'active' : ''}><u>U</u></button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}><TfiList></TfiList></button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}><TfiListOl></TfiListOl></button>
          <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={editor?.isActive('codeBlock') ? 'is-active' : ''}>{"</>"}</button>
          <button onClick={mentionAthena}>@Athena</button>
        </div>
  
        {/* 编辑器主体 */}
        <EditorContent editor={editor} className="editor-content" />
  
      </div>
    )
})

const uploadImage = async (file: File): Promise<string> => {
    console.log('uploading image')
    //具体逻辑

    return new Promise((resolve) => {
        setTimeout(() => {
          resolve('https://via.placeholder.com/400x300?text=Uploaded+Image')
        }, 1000)
      })
}

/*
* mention触发时进行异步请求，搜索相关用户，每次输入字符都会触发
*/
const fetchUsers = async (query: string) => {
  //创建搜索变量
  const data = new URLSearchParams({
    initial: query,
    per_page: '5',
  })
  try{
    
    const url = `/user/search-users?${data.toString()}`
    const response = await fetch(url, {
      method: 'GET'
    })
    
    if(!response.ok){
      throw new Error("Fetch user error!")
    }

    const userData = await response.json()
    //处理用户数据
    return userData

  }catch(error){
    console.error(error)
  }
  
}

//mention组件的建议功能，用户输入字符后触发异步请求
const suggestion = {
  char: '@',
  items: async ({ query }: { query: string }) => {
    //异步请求
    if(query){
      const users = await fetchUsers(query)
      console.log(users.users)
      return users.users.map((user: { username: any; user_id: any; }) => ({
        label: user.username,
        id: user.user_id
      }))
    }else{
      return []
    }

    // return users
    //   .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    //   .slice(0, 5)
  },
  render: () => {
    let component: HTMLDivElement
    let popup: TippyInstance

    return {
      onStart: (props: any) => {
        component = document.createElement('div')
        component.className = 'mention-list'

        props.items.forEach((item: any, index: number) => {
          console.log(item)
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
