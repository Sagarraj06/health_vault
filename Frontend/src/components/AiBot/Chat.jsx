'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your healthcare AI assistant. How can I help you today? You can ask me about symptoms, medications, or general health advice.",
      isUser: false
    },
    {
      text: "I've been having headaches for the past few days. What could be causing them?",
      isUser: true
    },
    {
      text: "Headaches can have many causes including stress, dehydration, lack of sleep, eye strain, or tension. If your headaches are persistent or severe, I'd recommend consulting with a doctor. In the meantime, try staying hydrated, getting adequate rest, and managing stress levels.",
      isUser: false
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="glass-card overflow-hidden flex flex-col" style={{ height: '70vh' }}>
        {/* Header */}
        <div className="flex items-center p-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mr-3">
            <Bot size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">Health AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <p className="text-emerald-400 text-xs">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`flex items-start gap-2.5 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${
                  message.isUser ? 'bg-primary/10' : 'bg-surface-elevated border border-white/[0.06]'
                }`}>
                  {message.isUser ? <User size={14} className="text-primary" /> : <Bot size={14} className="text-cyan-400" />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${message.isUser
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white/[0.03] text-gray-300 border border-white/[0.06] rounded-bl-sm'
                    }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center bg-white/[0.03] rounded-xl border border-white/[0.06] focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/10 transition-all">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent p-3 text-white text-sm focus:outline-none placeholder-gray-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="p-3 text-gray-500 hover:text-primary transition-colors disabled:opacity-30"
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
