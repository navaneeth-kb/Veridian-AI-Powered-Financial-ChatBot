import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ChevronUp } from 'lucide-react';
import './chatbot.css';
import type { Message } from '../types/chat.types';
import { chatService } from '../services/chatService';
import { formatMessage } from '../utils/messageFormatter';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI Financial Advisor. How can I help you with financial advice today? You can ask me about stocks, mutual funds, budgeting, investing, and more!",
      avatar: '🤖',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();

    // Validate input
    if (!textToSend || isLoading) {
      return;
    }

    // Clear input immediately
    setInputValue('');

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: textToSend,
      avatar: '👤',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add loading indicator
    const loadingMessage: Message = {
      id: Date.now() + 1,
      type: 'loading',
      content: 'Analyzing your financial query...',
      avatar: '🤖',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      // Call API
      const aiResponse = await chatService.sendMessage(textToSend);

      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.type !== 'loading');
        return [
          ...withoutLoading,
          {
            id: Date.now() + 2,
            type: 'assistant',
            content: aiResponse,
            avatar: '🤖',
            timestamp: new Date()
          }
        ];
      });

    } catch (error: any) {
      console.error('Chat error:', error);

      // Remove loading message and show error
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.type !== 'loading');
        return [
          ...withoutLoading,
          {
            id: Date.now() + 2,
            type: 'error',
            content: error.message || 'Failed to get response. Please try again.',
            avatar: '⚠️',
            timestamp: new Date()
          }
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handle action chip click
   */
  const handleChipClick = (chipText: string) => {
    setInputValue(chipText);
    inputRef.current?.focus();
  };

  /**
   * Render message content with formatting
   */
  const renderMessageContent = (message: Message) => {
    // Loading message
    if (message.type === 'loading') {
      return (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    // Error message
    if (message.type === 'error') {
      return (
        <div className="error-message">
          <p>{message.content}</p>
          <button 
            className="retry-button"
            onClick={() => {
              // Get the last user message and retry
              const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
              if (lastUserMessage) {
                handleSendMessage(lastUserMessage.content);
              }
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    // Regular message with formatting
    return <div className="message-content">{formatMessage(message.content)}</div>;
  };

  // Action chips
  const actionChips = [
    'Explain compound interest',
    'What are mutual funds?',
    'Diversification strategies',
    'Tax-saving investments'
  ];

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <button className="chatbot-back-button" aria-label="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="chatbot-title">AI Financial Advisor</h1>
      </div>

      {/* Chat Messages Area */}
      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${message.type === 'user' ? 'user' : ''}`}
          >
            {/* Avatar */}
            <div className={`message-avatar ${message.type}`}>
              {message.avatar}
            </div>

            {/* Message Bubble */}
            <div className={`message-bubble ${message.type}`}>
              {renderMessageContent(message)}
            </div>
          </div>
        ))}

        {/* Action Chips - only show when not loading */}
        {!isLoading && messages.length < 4 && (
          <div className="action-chips">
            {actionChips.map((chip, idx) => (
              <button
                key={idx}
                className="action-chip"
                onClick={() => handleChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Bar */}
      <div className="chatbot-input-container">
        <div className="chatbot-input-wrapper">
          {/* Plus Button */}
          <button className="input-button" aria-label="Add attachment">
            <Plus size={24} />
          </button>

          {/* Input Field */}
          <div className="chatbot-input-field">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about stocks, investing, finance..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={5000}
            />
            <button className="input-button" aria-label="Voice input">
              <Mic size={20} />
            </button>
          </div>

          {/* Send Button */}
          <button
            className={`send-button ${isLoading ? 'disabled' : ''}`}
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
