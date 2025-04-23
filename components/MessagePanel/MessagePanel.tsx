'use client';

import { useEffect, useState } from 'react';
import './MessagePanel.css';
import { getNotifications, markNotificationAsRead } from '@/app/api/Notification/router';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Notification {
  id: number;
  post_id: number;
  comment_id: number;
  post_title: string;
  type: string;
  content: string;
  created_at: string;
  read: boolean;
  created_by: {
    id: number;
    username: string;
    avatar: string;
  };
}

export function MessagePanel() {
  const [messages, setMessages] = useState<Notification[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMessages() {
      try {
        const data = await getNotifications();
        const filtered = data.filter((msg: Notification) => msg.post_id !== null);
        if (isMounted) {
          setMessages(filtered);
        }
      } catch (err) {
        console.error('获取通知失败:', err);
      }
    }

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      console.error(`标记通知 ${id} 为已读失败:`, err);
    }
  };

  const router = useRouter();

  const content = messages.map((msg) => (
    <div
      key={msg.id}
      className={`message-item ${msg.read ? 'read' : 'unread'}`}
      onClick={() => {
        if (!msg.read) {
          handleMarkAsRead(msg.id);
        }
        router.push(`/post/${msg.post_id}`);
      }}
    >
      <div className="message-header">
        <span className="sender-name">{msg.created_by.username}</span>
        <span className="message-type">
          {msg.type === 'replied' ? 'replied to you' : '@ you'}
        </span>
        <span className="timestamp">at {new Date(msg.created_at).toLocaleString()} :</span>
      </div>
      <div className="message-content">
        <span className="post-title-link">
          {msg.post_title || '[未命名帖子]'}
        </span>
      </div>
    </div>
  ));

  return (
    <div>
      <div className="content-box">{content}</div>
    </div>
  );
}
