import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the i",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to m",
      isUser: true
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the i",
      isUser: false
    },
    {
      text: "Lorem ipsum is simply dummy text of the printing and",
      isUser: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isUser: true }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark">
      {/* Header */}
      <div className="flex items-center p-4 bg-surface border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-primary/20 mr-3"></div>
        <div>
          <h1 className="text-white font-medium">My Chatbot</h1>
          <p className="text-primary text-sm">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-200 border border-white/10'
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-surface">
        <div className="flex items-center bg-dark rounded-lg border border-white/10">
          <input
            type="text"
            placeholder="Type your message here"
            className="flex-1 bg-transparent p-3 text-white focus:outline-none placeholder-gray-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 text-gray-400 hover:text-primary transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;