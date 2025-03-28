import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextInput,
  Button,
  Group,
  Text,
  ScrollArea,
  Loader,
  Avatar,
  Container,
  Title,
  Alert,
  Stack,
} from '@mantine/core';
import { IconSend, IconRobot, IconUser, IconInfoCircle } from '@tabler/icons-react';
import { generateAnswer } from '@/app/api/Athena/router';
import './Chatbot.css';

// 定义消息类型
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  // 状态管理：消息、输入框、加载状态和错误信息
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 用于滚动到聊天底部的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // 发送消息处理函数
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // 添加用户消息到聊天
    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用router中的方法发送请求到后端
      const response = await generateAnswer(input);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 添加机器人回复到聊天
      const botMessage: Message = {
        id: generateId(),
        text: data.result,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('很抱歉，处理您的请求时出现了错误。请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理回车键按下事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 建议问题列表
  const suggestedQuestions = [
    "什么是光合作用？",
    "中国四大发明是什么？",
    "如何解一元二次方程？",
    "牛顿第三定律是什么？"
  ];

  // 处理点击建议问题
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Container className="chat-container" size="lg">
      <Paper shadow="sm" p="md" withBorder className="chat-paper">
        <Title order={2} className="chat-title">
          <IconRobot size={24} /> AI 学习助手
        </Title>
        
        <Text color="dimmed" size="sm" mb="lg">
          有任何学习上的问题，都可以向我提问！
        </Text>
        
        {/* 聊天消息区域 */}
        <ScrollArea className="chat-messages" offsetScrollbars scrollbarSize={6}>
          {/* 欢迎信息（当没有消息时显示） */}
          {messages.length === 0 && (
            <Stack spacing="md">
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                title="如何使用学习助手" 
                color="blue" 
                radius="md"
              >
                你可以问我任何学科问题，我会尽力给你详细解答。
              </Alert>
              
              <Text size="sm" fw={500}>你可以尝试提问：</Text>
              <Group spacing="xs">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="light"
                    size="xs"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </Group>
            </Stack>
          )}
          
          {/* 显示消息记录 */}
          {messages.map((message) => (
            <Box
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <Group align="flex-start" spacing="xs">
                <Avatar
                  radius="xl"
                  size="md"
                  color={message.sender === 'user' ? 'blue' : 'green'}
                >
                  {message.sender === 'user' ? <IconUser size={18} /> : <IconRobot size={18} />}
                </Avatar>
                <Box className="message-content">
                  <div className={message.sender === 'bot' ? 'markdown-content' : 'message-text'}>
                    {message.text}
                  </div>
                  <Text size="xs" color="dimmed" className="message-time">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Box>
              </Group>
            </Box>
          ))}
          
          {/* 加载指示器 */}
          {isLoading && (
            <Box className="message bot-message">
              <Group align="flex-start" spacing="xs">
                <Avatar radius="xl" size="md" color="green">
                  <IconRobot size={18} />
                </Avatar>
                <Box className="message-content loading-content">
                  <Loader size="sm" />
                </Box>
              </Group>
            </Box>
          )}
          
          {/* 错误信息 */}
          {error && (
            <Alert color="red" title="发生错误" className="error-alert">
              {error}
            </Alert>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* 输入区域 */}
        <Box className="input-area">
          <TextInput
            className="message-input"
            placeholder="输入你想问的问题..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rightSection={
              <Button
                color="blue"
                radius="xl"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
              >
                <IconSend size={16} />
              </Button>
            }
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Chatbot;
