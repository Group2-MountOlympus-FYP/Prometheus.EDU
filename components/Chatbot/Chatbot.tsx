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
  Tabs,
  Menu,
  ActionIcon,
  List,
} from '@mantine/core';
import { 
  IconSend, 
  IconRobot, 
  IconUser, 
  IconInfoCircle, 
  IconDownload, 
  IconDotsVertical, 
  IconSearch,
  IconBrain
} from '@tabler/icons-react';
import { 
  generateAnswer, 
  generateWithoutRAG, 
  retrieveDocumentsOnly, 
  generateReport 
} from '@/app/api/Athena/router';
import './Chatbot.css';

// 定义消息类型
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  mode?: 'rag' | 'norag' | 'docs';
  documents?: string[];
}

const Chatbot: React.FC = () => {
  // 状态管理：消息、输入框、加载状态和错误信息
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 查询模式: 'rag' (默认), 'norag', 'docs'
  const [queryMode, setQueryMode] = useState<'rag' | 'norag' | 'docs'>('rag');
  
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

  // 处理生成PDF报告
  const handleGenerateReport = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await generateReport(query);
      
      if (!response.ok) {
        throw new Error(`生成报告失败: ${response.status} ${response.statusText}`);
      }
      
      // 获取 blob 数据并创建下载链接
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'athena_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      console.error('生成报告时出错:', err);
      setError(`Failed to generate PDF report: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 从API响应中提取文本内容
  const extractTextFromResponse = (data: any): string => {
    // 如果data.result是字符串，直接返回
    if (typeof data.result === 'string') {
      return data.result;
    }
    
    // 如果data.result是对象且包含result字段
    if (data.result && typeof data.result === 'object' && 'result' in data.result) {
      return typeof data.result.result === 'string' 
        ? data.result.result 
        : JSON.stringify(data.result.result);
    }
    
    // 如果没有找到合适的文本，则返回整个结果的字符串形式
    return JSON.stringify(data.result);
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
      mode: queryMode
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentQuery = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      let data;
      
      // 根据不同的查询模式选择不同的API
      switch (queryMode) {
        case 'rag':
          response = await generateAnswer(currentQuery);
          if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
          }
          data = await response.json();
          console.log("API返回数据:", data); // 调试日志
          
          // 添加机器人回复到聊天 - 使用提取函数处理嵌套结构
          setMessages(prevMessages => [...prevMessages, {
            id: generateId(),
            text: extractTextFromResponse(data),
            sender: 'bot',
            timestamp: new Date(),
            mode: 'rag'
          }]);
          break;
          
        case 'norag':
          response = await generateWithoutRAG(currentQuery);
          if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
          }
          data = await response.json();
          console.log("非RAG API返回数据:", data); // 调试日志
          
          // 添加机器人回复到聊天 - 使用提取函数处理嵌套结构
          setMessages(prevMessages => [...prevMessages, {
            id: generateId(),
            text: extractTextFromResponse(data),
            sender: 'bot',
            timestamp: new Date(),
            mode: 'norag'
          }]);
          break;
          
        case 'docs':
          response = await retrieveDocumentsOnly(currentQuery);
          if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
          }
          data = await response.json();
          console.log("文档检索API返回数据:", data); // 调试日志
          
          // 确保documents是字符串数组
          let documents: string[] = [];
          if (data.documents && Array.isArray(data.documents)) {
            documents = data.documents.map((doc: any) => 
              typeof doc === 'string' ? doc : JSON.stringify(doc)
            );
          }
          
          // 添加包含检索文档的回复
          setMessages(prevMessages => [...prevMessages, {
            id: generateId(),
            text: "Here are document excerpts relevant to your question:",
            sender: 'bot',
            timestamp: new Date(),
            mode: 'docs',
            documents: documents
          }]);
          break;
      }
    } catch (err: any) {
      console.error('发送消息时出错:', err);
      
      // 显示更具体的错误信息
      if (err.message.includes('无法连接到后端服务器')) {
        setError('Unable to connect to AI server. Please ensure the backend server is running. If the problem persists, contact technical support.');
      } else if (err.message.includes('服务器响应错误')) {
        setError(err.message.replace('服务器响应错误', 'Server response error'));
      } else if (err.message.includes('提交的表单数据无效')) {
        setError('The submitted form data is invalid. Please ensure your question is not empty and is properly formatted.');
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network connection failed. Please check your network connection and ensure the backend server is running.');
      } else {
        setError(`An error occurred while processing your request: ${err.message}`);
      }
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
    "What is photosynthesis?",
    "What are the Four Great Inventions of ancient China?",
    "How do I solve a quadratic equation?",
    "What is Newton's Third Law?"
  ];

  // 处理点击建议问题
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  // 渲染文档列表
  const renderDocuments = (documents: string[] = []) => {
    return (
      <Box className="documents-list">
        {documents.map((doc, index) => (
          <Paper key={index} p="xs" mb="xs" withBorder>
            <Text size="sm">{doc}</Text>
          </Paper>
        ))}
      </Box>
    );
  };

  // 获取查询模式的标签文本
  const getModeLabel = (mode?: 'rag' | 'norag' | 'docs') => {
    switch (mode) {
      case 'rag': return 'Using RAG';
      case 'norag': return 'Without RAG';
      case 'docs': return 'Documents Only';
      default: return '';
    }
  };
  
  // 安全渲染文本内容，确保不会直接渲染对象
  const renderMessageText = (text: any) => {
    if (typeof text === 'string') {
      return text;
    } else if (text === null || text === undefined) {
      return '';
    } else {
      // 如果是对象，转为JSON字符串
      return JSON.stringify(text);
    }
  };
  
  return (
    <Container className="chat-container" size="lg">
      <Paper shadow="sm" p="md" withBorder className="chat-paper">
        <Group position="apart" mb="md">
          <Title order={2} className="chat-title">
            <IconRobot size={24} /> AthenaTutor
          </Title>
          <Text c="dimmed" size="xs" mb="lg"> powered by Athena Intelligence</Text>

          
          <Tabs
            value={queryMode}
            onChange={(value) => setQueryMode(value as 'rag' | 'norag' | 'docs')}
            radius="xl"
            variant="pills"
          >
            <Tabs.List>
              <Tabs.Tab value="rag" icon={<IconBrain size={16} />}>Use RAG</Tabs.Tab>
              <Tabs.Tab value="norag" icon={<IconRobot size={16} />}>No RAG</Tabs.Tab>
              <Tabs.Tab value="docs" icon={<IconSearch size={16} />}>Docs Only</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>
        
        <Text color="dimmed" size="sm" mb="lg">
          Feel free to ask me any learning questions! Current mode: <b>{getModeLabel(queryMode)}</b>
        </Text>
        
        {/* 聊天消息区域 */}
        <ScrollArea className="chat-messages" offsetScrollbars scrollbarSize={6}>
          {/* 欢迎信息（当没有消息时显示） */}
          {messages.length === 0 && (
            <Stack spacing="md">
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                title="How to Use the Learning Assistant" 
                color="blue" 
                radius="md"
              >
                <Text mb="xs">You can ask me any subject questions, and I'll do my best to provide detailed answers.</Text>
                <Box>
                  <Text><b>Mode Descriptions:</b></Text>
                  <List spacing="xs" size="sm">
                    <List.Item><b>Use RAG</b>: Generate detailed answers based on relevant learning materials</List.Item>
                    <List.Item><b>No RAG</b>: Generate answers directly without using learning materials</List.Item>
                    <List.Item><b>Docs Only</b>: Only return reference materials relevant to your question</List.Item>
                  </List>
                </Box>
              </Alert>
              
              <Text size="sm" fw={500}>You can try asking:</Text>
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
              <Group align="flex-start" spacing="xs" style={{flexWrap: 'nowrap'}}>
                <Avatar
                  radius="xl"
                  size="md"
                  color={message.sender === 'user' ? 'blue' : 'green'}
                >
                  {message.sender === 'user' ? <IconUser size={18} /> : <IconRobot size={18} />}
                </Avatar>
                
                <Box className="message-content">
                  {message.mode && message.sender === 'user' && (
                    <Text size="xs" fw={500} c="dimmed" mb={4}>
                      Request mode: {getModeLabel(message.mode)}
                    </Text>
                  )}
                  
                  <div className={message.sender === 'bot' ? 'markdown-content' : 'message-text'}>
                    {/* 使用安全的文本渲染方法 */}
                    {renderMessageText(message.text)}
                  </div>
                  
                  {/* 显示检索到的文档 */}
                  {message.documents && message.documents.length > 0 && (
                    renderDocuments(message.documents)
                  )}
                  
                  <Group position="apart" mt={4}>
                    <Text size="xs" c="dimmed" className="message-time">
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    
                    {/* 机器人回复的操作菜单 */}
                    {message.sender === 'bot' && (
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon size="xs" variant="subtle">
                            <IconDotsVertical size={12} />
                          </ActionIcon>
                        </Menu.Target>
                        
                        <Menu.Dropdown>
                          <Menu.Item
                            icon={<IconDownload size={14} />}
                            onClick={() => handleGenerateReport(
                              typeof message.text === 'string' ? message.text : JSON.stringify(message.text)
                            )}
                          >
                            Generate PDF Report
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>
                </Box>
              </Group>
            </Box>
          ))}
          
          {/* 加载指示器 */}
          {isLoading && (
            <Box className="message bot-message">
              <Group align="flex-start" spacing="xs" style={{flexWrap: 'nowrap'}}>
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
            <Alert color="red" title="Error" className="error-alert">
              {error}
            </Alert>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        {/* 输入区域 */}
        <Box className="input-area">
          <TextInput
            className="message-input"
            placeholder="Enter your question..."
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
