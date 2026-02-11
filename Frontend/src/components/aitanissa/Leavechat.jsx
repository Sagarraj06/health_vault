import React, { useState } from 'react';
import { api, ai_api } from '../../axios.config.js';

const Leavechat = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await ai_api.post('/leaverelated', { question });
      setResponse(res.data);
      setChatHistory([...chatHistory, { type: 'user', content: question }, { type: 'ai', content: res.data.answer }]);
      setQuestion('');
    } catch (err) {
      setError('Error getting leave status. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    if (!text) return null;
    const cleanedText = text.replace(/stred/gi, '').replace(/\*/g, '');
    return cleanedText.split('\n').map((line, index) => (
      <p key={index} className="font-medium text-sm">{line.trim()}</p>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="bg-card border-b border-border text-text p-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-text font-heading">Leave Management System</h1>
          <p className="text-sm md:text-base text-text-light">Ask questions about your leave status</p>
        </div>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-6xl mx-auto w-full p-4 gap-4">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-card border border-border rounded-2xl p-4 overflow-y-auto mb-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted my-8">
                <div className="mb-3 bg-primary/10 p-4 rounded-full inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-text-light">Ask a question about your leave status</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-full md:max-w-3/4 rounded-2xl p-4 ${message.type === 'user' ? 'bg-primary text-white font-medium' : 'bg-surface-alt border border-border text-text font-medium'}`}>
                      <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about your leave status..." className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-muted text-sm" required />
              <button type="submit" disabled={loading} className="w-full sm:w-auto btn-animated bg-primary text-white font-medium py-2.5 px-6 rounded-xl disabled:opacity-70 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Asking...
                  </span>
                ) : 'Send'}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-xl border border-red-200 mt-3">{error}</p>}
          </form>
        </div>
        <div className="w-full md:w-80 bg-card border border-border rounded-2xl p-6 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-primary border-b border-border pb-2">Response Details</h2>
          {response ? (
            <div>
              <div className="bg-surface-alt p-4 rounded-xl mb-4 border border-border">
                <div className="text-sm font-semibold text-muted mb-1">Answer:</div>
                <div className="text-text">{formatResponse(response.answer)}</div>
              </div>
              <div className="bg-surface-alt p-4 rounded-xl border border-border">
                <div className="text-sm font-semibold text-muted mb-1">Status:</div>
                <div className="text-sm font-semibold">
                  {response.status === 'success' ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">{response.status}</span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2 py-1 rounded-lg">{response.status}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted my-8 text-sm">Submit a question to see response details</div>
          )}
          <div className="mt-6 text-xs text-muted">
            <p>Example questions:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-text-light">
              <li>How many leave days do I have left?</li>
              <li>When was my last leave request?</li>
              <li>Are any of my leaves confirmed?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leavechat;
