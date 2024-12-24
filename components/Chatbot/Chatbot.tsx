import { Button, Input } from '@mantine/core';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '@mantine/core';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatbotWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '您好！我是您的 AI 顾问。您可以问我跟可持续发展有关的问题。',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleSendMessage = async (): Promise<void> => {
    if (input.trim() === '') return;

    // Add the user's message to the chat
    const newMessages: Message[] = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Directly call the LLM API with a POST request
      const response = await fetch('', { // TODO Add the LLM API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chatbot response');
      }

      // Get the response text from the LLM API
      const data = await response.json();
      let botMessage = data.text;

      // Remove <ref> tags from the bot's response
      botMessage = botMessage.replace(/<ref>.*?<\/ref>/g, '');

      // Add the bot's response to the chat
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: '抱歉，似乎出现了一些问题。请稍后再试。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          borderRadius: '30px',
          backgroundColor: 'rgba(55, 120, 100, 0.8)', // 半透明背景色
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '32px', // 斜下偏移
            right: '8px',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: 'rgba(55, 230, 100, 1)',
            zIndex: -1, // 置于半透明按钮下方
          }}
        ></div>

        <Button
          onClick={toggleChatbot}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(55, 180, 100, 0.68)',
            color: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        >
          <FontAwesomeIcon icon={faComment} />
        </Button>
        <span
          style={{
            fontSize: '15px',
            color: 'white',
            userSelect: 'none',
            fontWeight: 'bold',
            paddingTop: '8px',
          }}
        >
          AI 问答
        </span>
      </div>

      {/* Chatbot Window */}
      {isChatbotOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            width: '620px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h2 style={{ margin: 0 }}>碳交易 AI 顾问</h2>

            <button
              onClick={toggleChatbot}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'black',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Chatbot Component */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '580px',
              height: '400px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <div
              style={{
                flex: 1,
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: msg.sender === 'user' ? '#018a53' : '#e0e0e0',
                      color: msg.sender === 'user' ? '#fff' : '#000',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div style={{ textAlign: 'left', color: '#555' }}><Loader color="teal" size="sm" type="dots" /> </div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="请输入问题"
                style={{
                  flex: 1,
                  padding: '8px',
                  marginRight: '5px',
                }}
              />
              <Button onClick={handleSendMessage} variant="filled" color="teal">
                发送
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

