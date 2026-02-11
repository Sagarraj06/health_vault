import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", isUser: false },
    { text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.", isUser: false },
    { text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.", isUser: true },
    { text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.", isUser: false },
    { text: "Lorem ipsum is simply dummy text of the printing.", isUser: true }
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
    <div className="flex flex-col h-screen bg-surface">
      <div className="flex items-center p-4 bg-card border-b border-border shadow-sm">
        <div className="w-8 h-8 rounded-full bg-primary/10 mr-3 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
        <div>
          <h1 className="text-text font-semibold">My Chatbot</h1>
          <p className="text-primary text-sm">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${message.isUser ? 'bg-primary text-white' : 'bg-card text-text border border-border'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-border bg-card">
        <div className="flex items-center bg-surface rounded-xl border border-border">
          <input type="text" placeholder="Type your message here" className="flex-1 bg-transparent p-3 text-text focus:outline-none placeholder-muted text-sm" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button type="submit" className="p-3 text-muted hover:text-primary transition-colors"><Send size={20} /></button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
