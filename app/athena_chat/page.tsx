'use client';

import React from 'react';
import Chatbot from '@/components/Chatbot/Chatbot';


export default function AthenaChatPage() {
  return (
    <div className="athena-chat-page">
      <Chatbot />
    </div>
  );
}

// 'use client'
//
// import React from 'react';
// import { NextPage } from 'next';
// import Head from 'next/head';
// import { Container } from '@mantine/core';
// import Chatbot from '@/components/Chatbot/Chatbot';
//
// const ChatBotPage: NextPage = () => {
//   return (
//     <>
//       <Head>
//         <title>AI 学习助手 | 在线问答</title>
//         <meta name="description" content="使用AI学习助手解答你的学习疑问" />
//       </Head>
//       <Container fluid p={0}>
//         <Chatbot />
//       </Container>
//     </>
//   );
// };
//
// export default ChatBotPage;
