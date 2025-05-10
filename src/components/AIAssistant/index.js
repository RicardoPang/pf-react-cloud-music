import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from '../../api/utils';
import { CSSTransition } from 'react-transition-group';
import style from '../../assets/global-style';

// GraphQL查询和变更定义
const TEST_QUERY = `
  query {
    test {
      success
      message
      timestamp
      data {
        name
        version
        features
        model
      }
    }
  }
`;

const CHAT_MUTATION = `
  mutation ChatWithAI($prompt: String!) {
    chat(prompt: $prompt) {
      success
      message
      data {
        choices {
          message {
            content
          }
        }
        model
        usage {
          prompt_tokens
          completion_tokens
          total_tokens
        }
      }
      error
    }
  }
`;

// 样式定义
const Container = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ChatButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${style['theme-color']};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ChatPanel = styled.div`
  width: 300px;
  max-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.panel-enter {
    opacity: 0;
    transform: scale(0.9);
  }

  &.panel-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity 300ms, transform 300ms;
  }

  &.panel-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.panel-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }
`;

const ChatHeader = styled.div`
  padding: 12px 15px;
  background: ${style['theme-color']};
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.span`
  cursor: pointer;
  font-size: 18px;
`;

const ChatContent = styled.div`
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  max-height: 250px;

  p {
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .ai-message {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;

    .dot {
      width: 8px;
      height: 8px;
      background: ${style['theme-color']};
      border-radius: 50%;
      margin: 0 3px;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }

    @keyframes bounce {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  }
`;

const InputArea = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 15px;
  outline: none;

  &:focus {
    border-color: ${style['theme-color']};
  }
`;

const SendButton = styled.button`
  background: ${style['theme-color']};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  margin-left: 10px;
  cursor: pointer;
  outline: none;

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

// AI助手组件
const AIAssistant = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResponse, setTestResponse] = useState(null);

  // 组件加载时获取测试响应
  useEffect(() => {
    // 使用GraphQL从Cloudflare Worker获取测试响应
    const fetchTestResponse = async () => {
      try {
        // 替换为你的Cloudflare Worker GraphQL端点
        const workerUrl =
          'https://cloud-music-ai-assistant.ricardo-pangj.workers.dev/graphql';
        
        // 发送GraphQL查询
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: TEST_QUERY
          }),
        });
        
        const result = await response.json();
        
        // 检查GraphQL响应是否有错误
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // 从GraphQL响应中提取数据
        const data = result.data.test;
        setTestResponse(data);

        // 添加欢迎消息
        setMessages([
          {
            type: 'ai',
            content: `${data.message} 我是${
              data.data.name
            }，可以帮你解答关于音乐的问题。我支持的功能包括：${data.data.features.join(
              '、'
            )}。`,
          },
        ]);
      } catch (error) {
        console.error('获取测试响应失败:', error);
        // 添加默认欢迎消息
        setMessages([
          {
            type: 'ai',
            content:
              '欢迎使用AI助手！我可以帮你推荐音乐、解析歌词或介绍艺术家。',
          },
        ]);
      }
    };

    if (showChat && messages.length === 0) {
      fetchTestResponse();
    }
  }, [showChat, messages.length]);

  // 使用GraphQL发送消息到AI助手
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // 添加用户消息
    const userMessage = { type: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 替换为你的Cloudflare Worker GraphQL端点
      const workerUrl =
        'https://cloud-music-ai-assistant.ricardo-pangj.workers.dev/graphql';
      
      // 发送GraphQL变更操作
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CHAT_MUTATION,
          variables: { prompt: input }
        }),
      });

      const result = await response.json();
      
      // 检查GraphQL响应是否有错误
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      // 从GraphQL响应中提取数据
      const data = result.data.chat;

      if (data.success && data.data?.choices && data.data.choices.length > 0) {
        // 添加AI响应
        const aiMessage = {
          type: 'ai',
          content: data.data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // 处理错误响应
        const errorMessage = {
          type: 'ai',
          content: data.error || '抱歉，我无法处理你的请求。请稍后再试。',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 添加错误消息
      const errorMessage = {
        type: 'ai',
        content: '抱歉，连接出现问题。请检查网络连接后再试。',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 使用防抖处理输入 - 在GraphQL实现中不再需要，但保留以备将来使用
  const debouncedSetInput = debounce((value) => {
    setInput(value);
  }, 300);

  const handleInputChange = (e) => {
    // 在事件处理前保存事件值，防止React事件池回收问题
    const value = e.target.value;
    // 直接更新输入值，确保UI立即响应
    setInput(value);
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // 切换聊天面板显示状态
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <Container>
      <CSSTransition
        in={showChat}
        timeout={300}
        classNames="panel"
        unmountOnExit
      >
        <ChatPanel>
          <ChatHeader>
            <span>云音乐AI助手</span>
            <CloseButton onClick={toggleChat}>×</CloseButton>
          </ChatHeader>
          <ChatContent>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === 'ai' ? 'ai-message' : ''}
              >
                <p>
                  <strong>{msg.type === 'ai' ? 'AI助手:' : '你:'}</strong>{' '}
                  {msg.content}
                </p>
              </div>
            ))}
            {loading && (
              <div className="loading">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </ChatContent>
          <InputArea>
            <Input
              placeholder="输入你的问题..."
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={input}
            />
            <SendButton
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              发送
            </SendButton>
          </InputArea>
        </ChatPanel>
      </CSSTransition>
      <ChatButton onClick={toggleChat}>{showChat ? '×' : '?'}</ChatButton>
    </Container>
  );
};

export default React.memo(AIAssistant);
