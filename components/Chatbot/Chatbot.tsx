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

// 定义API响应类型
interface ApiResponse {
  result: string | { result: string } | any;
  documents?: string[];
}

const Chatbot: React.FC = () => {
  // 状态管理：消息、输入框、加载状态和错误信息
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryMode, setQueryMode] = useState<'rag' | 'norag' | 'docs'>('rag');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleGenerateReport = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await generateReport(query);

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status} ${response.statusText}`);
      }

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
      console.error('Error generating report:', err);
      setError(`Failed to generate PDF report: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromResponse = (data: ApiResponse): string => {
    if (typeof data.result === 'string') {
      return data.result;
    }

    if (data.result && typeof data.result === 'object' && 'result' in data.result) {
      return typeof data.result.result === 'string'
        ? data.result.result
        : JSON.stringify(data.result.result);
    }

    return JSON.stringify(data.result);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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
      let response: Response;
      let data: ApiResponse;

      switch (queryMode) {
        case 'rag':
          response = await generateAnswer(currentQuery);
          if (!response.ok) {
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
          }
          data = await response.json();

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
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
          }
          data = await response.json();

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
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
          }
          data = await response.json();

          let documents: string[] = [];
          if (data.documents && Array.isArray(data.documents)) {
            documents = data.documents.map((doc: any) => 
              typeof doc === 'string' ? doc : JSON.stringify(doc)
            );
          }

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
      console.error('Error sending message:', err);

      if (err.message.includes('Unable to connect to backend server')) {
        setError('Unable to connect to AI server. Please ensure the backend server is running. If the problem persists, contact technical support.');
      } else if (err.message.includes('Server response error')) {
        setError(err.message);
      } else if (err.message.includes('Invalid form data')) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What is photosynthesis?",
    "What are the Four Great Inventions of ancient China?",
    "How do I solve a quadratic equation?",
    "What is Newton's Third Law?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

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

  const getModeLabel = (mode?: 'rag' | 'norag' | 'docs') => {
    switch (mode) {
      case 'rag': return 'Using RAG';
      case 'norag': return 'Without RAG';
      case 'docs': return 'Documents Only';
      default: return '';
    }
  };

  const renderMessageText = (text: any) => {
    if (typeof text === 'string') {
      return text;
    } else if (text === null || text === undefined) {
      return '';
    } else {
      return JSON.stringify(text);
    }
  };

  return (
    <Container className="chat-container" size="lg">
      <Paper shadow="sm" p="md" withBorder className="chat-paper">
        <Group justify="space-between" mb="md">
          <Title order={2} className="chat-title">
            <IconRobot size={24} /> AthenaTutor
          </Title>
          <Text c="dimmed" size="xs"> powered by Athena Intelligence</Text>

          <Tabs
            value={queryMode}
            onChange={(value) => setQueryMode(value as 'rag' | 'norag' | 'docs')}
            radius="xl"
            variant="pills"
          >
            <Tabs.List>
              <Tabs.Tab value="rag" leftSection={<IconBrain size={16} />}>Use RAG</Tabs.Tab>
              <Tabs.Tab value="norag" leftSection={<IconRobot size={16} />}>No RAG</Tabs.Tab>
              <Tabs.Tab value="docs" leftSection={<IconSearch size={16} />}>Docs Only</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>

        <Text c="dimmed" size="sm" mb="lg">
          Feel free to ask me any learning questions! Current mode: <b>{getModeLabel(queryMode)}</b>
        </Text>

        <ScrollArea className="chat-messages" offsetScrollbars scrollbarSize={6}>
          {messages.length === 0 && (
            <Stack gap="md">
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
              <Group gap="xs">
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

          {messages.map((message) => (
            <Box
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <Group align="flex-start" gap="xs" style={{flexWrap: 'nowrap'}}>
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
                    {renderMessageText(message.text)}
                  </div>

                  {message.documents && message.documents.length > 0 && (
                    renderDocuments(message.documents)
                  )}

                  <Group justify="space-between" mt={4}>
                    <Text size="xs" c="dimmed" className="message-time">
                      {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Text>

                    {message.sender === 'bot' && (
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon size="xs" variant="subtle">
                            <IconDotsVertical size={12} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconDownload size={14} />}
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

          {isLoading && (
            <Box className="message bot-message">
              <Group align="flex-start" gap="xs" style={{flexWrap: 'nowrap'}}>
                <Avatar radius="xl" size="md" color="green">
                  <IconRobot size={18} />
                </Avatar>
                <Box className="message-content loading-content">
                  <Loader size="sm" />
                </Box>
              </Group>
            </Box>
          )}

          {error && (
            <Alert color="red" title="Error" className="error-alert">
              {error}
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>

        <Box className="input-area">
          <TextInput
            className="message-input"
            placeholder="Enter your question..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rightSection={
              <ActionIcon
                size="lg"
                color="blue"
                radius="xl"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
              >

                <IconSend />
              </ActionIcon>
            }
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Chatbot;
