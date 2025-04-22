'use client'
import './MessagePanel.css'
import { IoCloseSharp } from "react-icons/io5";


export function MessagePanel() {

    const messages = [
        {
          id: 1,
          user: 'Peyby',
          type: 'replies', // or 'mentions'
          timestamp: '2025-04-17 10:30',
          isRead: false,
          content: 'Thanks for your comment!',
        },
        {
          id: 2,
          user: 'Peybo',
          type: '@',
          timestamp: '2025-04-17 09:45',
          isRead: true,
          content: 'Please check this update.',
        },
      ];
      
    const content = messages.map((msg) => (
        <div key={msg.id} className={`message-item ${msg.isRead ? 'read' : 'unread'}`}>
          <div className="message-header">
            <span className="sender-name">{msg.user}</span>
            <span className="message-type">{msg.type === 'replies' ? 'replied to you' : '@ you'}</span>
            <span className="timestamp">at {msg.timestamp} :</span>
          </div>
          <div className="message-content">
            {msg.content}
          </div>
        </div>
    ));

    return (
        <div>
            {/* <div className="message-img"></div> */}

            <div className="content-box">
                {content}
            </div>

            <div className="placeholder"></div>
        </div>
    )
}
