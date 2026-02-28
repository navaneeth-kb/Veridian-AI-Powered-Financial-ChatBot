import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ChevronUp } from 'lucide-react';
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
        <div className="flex items-center gap-1 p-2">
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse wait-200"></span>
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse wait-400"></span>
        </div>
      );
    }

    // Error message
    if (message.type === 'error') {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-red-800 text-sm m-0">{message.content}</p>
          <button
            className="self-start py-1.5 px-3 bg-red-500 text-white border-none rounded-md text-xs font-medium cursor-pointer transition-colors hover:bg-red-600"
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
    return <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{formatMessage(message.content)}</div>;
  };

  // Action chips
  const actionChips = [
    'Explain compound interest',
    'What are mutual funds?',
    'Diversification strategies',
    'Tax-saving investments'
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f0f9f4]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm">
        <button className="mr-3 text-gray-600 bg-transparent border-none cursor-pointer p-1 flex items-center transition-colors hover:text-gray-800" aria-label="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">AI Financial Advisor</h1>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${message.type === 'assistant' ? 'bg-teal-400' :
                message.type === 'user' ? 'bg-orange-400' :
                  message.type === 'loading' ? 'bg-slate-400' :
                    'bg-red-400'
              }`}>
              {message.avatar}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[75%] rounded-2xl py-3 px-4 shadow-sm bg-white ${message.type === 'assistant' ? 'rounded-tl-none' :
                message.type === 'user' ? 'rounded-tr-none border-l-4 border-orange-400' :
                  message.type === 'error' ? 'bg-red-100 border-l-4 border-red-500' :
                    'bg-slate-100'
              }`}>
              {renderMessageContent(message)}
            </div>
          </div>
        ))}

        {/* Action Chips - only show when not loading */}
        {!isLoading && messages.length < 4 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {actionChips.map((chip, idx) => (
              <button
                key={idx}
                className="py-2 px-4 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border-none cursor-pointer transition-colors hover:bg-blue-200"
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
      <div className="bg-white border-t border-gray-200 py-3 px-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          {/* Plus Button */}
          <button className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 bg-transparent border-none rounded-full cursor-pointer transition-colors hover:bg-gray-100" aria-label="Add attachment">
            <Plus size={24} />
          </button>

          {/* Input Field */}
          <div className="flex-1 bg-gray-100 rounded-full py-2 px-4 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about stocks, investing, finance..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={5000}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 bg-transparent border-none rounded-full cursor-pointer transition-colors hover:bg-gray-100" aria-label="Voice input">
              <Mic size={20} />
            </button>
          </div>

          {/* Send Button */}
          <button
            className={`shrink-0 w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white border-none cursor-pointer shadow-md transition-colors hover:not(:disabled):bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
