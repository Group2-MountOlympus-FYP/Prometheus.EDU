'use client'

import { forwardRef, useEffect, useImperativeHandle } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from '@tiptap/extension-underline'
import './CommentEditor.css'
import 'tippy.js/dist/tippy.css'
import Blockquote from "@tiptap/extension-blockquote";
import { TfiList } from "react-icons/tfi";
import { TfiListOl } from "react-icons/tfi";
import CodeBlock from "@tiptap/extension-code-block";

export const CommentEditor = forwardRef((props, ref) => {

    const editor = useEditor({
        extensions: [
          StarterKit,
          Image,
          BulletList, OrderedList, ListItem, Paragraph, Underline, 
          Blockquote.configure({
            HTMLAttributes:{
              class: 'quote'
            }
          }),
        ],
        content: '',
    })
        
    const handleImageUpload = async (file: File) => {
        if (!file || !editor) return

        try{
          const url = await uploadImage(file)
          //console.log(url)

          if(url){
            if(url){
              // 插入图片
              editor.chain().focus().setImage({ src: url }).run()
            }else{
              console.error("上传失败,未返回有效URL")
            }
          }
        }catch(error){
          console.log("upload image error")
          console.log(error)
        }       
        
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
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'active' : ''}><b>B</b></button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'active' : ''}><i>I</i></button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'active' : ''}><u>U</u></button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'active' : ''}><TfiList></TfiList></button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}><TfiListOl></TfiListOl></button>
        </div>
  
        {/* 编辑器主体 */}
        <EditorContent editor={editor} className="editor-content" />
  
      </div>
    )
})

const uploadImage = async (file: File):Promise<string> => {
    //console.log('uploading image')

    //具体逻辑
    const url = '/backend/post/add_image'
    const formData = new FormData()
    formData.append('image', file)
    const response = await fetch(url, {
      method: 'POST', // 确保是 POST 方法
      body: formData, // 这里一定要传 FormData
    })
    
    if( response.ok ){
      const url = await response.text()
      //console.log(url)
      return url
    }else{
      return ""
    }
}
