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
      // Make API call to the leave-related API
      const res = await ai_api.post('/leaverelated', {
        question: question,
      });

      // Store the response and update chat history
      setResponse(res.data);
      setChatHistory([
        ...chatHistory,
        { type: 'user', content: question },
        { type: 'ai', content: res.data.answer },
      ]);

      // Clear question input
      setQuestion('');
    } catch (err) {
      setError('Error getting leave status. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the API response: remove "stred" and any '*' characters, split by newline, and render each line as a bold paragraph
  const formatResponse = (text) => {
    if (!text) return null;
    // Remove "stred" (case-insensitive) and asterisks
    const cleanedText = text.replace(/stred/gi, '').replace(/\*/g, '');
    return cleanedText.split('\n').map((line, index) => (
      <p key={index} className="font-bold">
        {line.trim()}
      </p>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header */}
      <header className="glass-card border-b border-white/10 text-white p-4 shadow-lg rounded-none">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Leave Management System</h1>
          <p className="text-sm md:text-base text-gray-400">Ask questions about your leave status</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-6xl mx-auto w-full p-4 gap-4">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
          {/* Chat History */}
          <div className="flex-1 glass-card rounded-2xl shadow-xl p-4 overflow-y-auto mb-4 border border-white/10">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 my-8">
                <div className="mb-3 bg-primary/10 p-4 rounded-full inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p>Ask a question about your leave status</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-full md:max-w-3/4 rounded-2xl p-4 shadow-md ${message.type === 'user'
                        ? 'bg-primary text-white font-medium'
                        : 'bg-surface border border-white/10 text-gray-200 font-medium'
                        }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl shadow-xl p-4 border border-white/10">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about your leave status..."
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-dark text-white focus:outline-none focus:border-primary transition-all duration-300 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto btn-animated bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-6 rounded-xl disabled:opacity-70 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Asking...
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
            </div>
          </form>
        </div>

        {/* Response Panel */}
        <div className="w-full md:w-80 glass-card rounded-2xl shadow-xl p-6 border border-white/10 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-primary border-b border-white/10 pb-2">Response Details</h2>

          {response ? (
            <div>
              <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
                <div className="text-sm font-bold text-gray-400 mb-1">Answer:</div>
                <div className="text-lg text-gray-200">{formatResponse(response.answer)}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-sm font-bold text-gray-400 mb-1">Status:</div>
                <div className="text-sm font-bold">
                  {response.status === 'success' ? (
                    <span className="text-green-400 bg-green-500/20 px-2 py-1 rounded">{response.status}</span>
                  ) : (
                    <span className="text-red-400 bg-red-500/20 px-2 py-1 rounded">{response.status}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 my-8">
              Submit a question to see response details
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500">
            <p>Example questions:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-400">
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
