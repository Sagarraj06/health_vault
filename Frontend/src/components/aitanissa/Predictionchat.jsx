import React, { useState } from 'react';
import { ai_api } from '../../axios.config';

const Predictionchat = () => {
  const [symptoms, setSymptoms] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const formatText = (text) => {
    if (!text) return null;
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      parts.push(<strong key={lastIndex}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const symptomsArray = symptoms.split(',').map(s => s.trim()).filter(s => s !== '');
      const res = await ai_api.post('/disease_prediction', { symptoms: symptomsArray });
      const formattedResponse = res.data;
      setResponse(formattedResponse);
      setChatHistory([...chatHistory, { type: 'user', content: `Symptoms: ${symptomsArray.join(', ')}` }, { type: 'ai', content: formattedResponse.prediction }]);
      setSymptoms('');
    } catch (err) {
      setError('Error getting prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="bg-card border-b border-border text-text p-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center">
          <div className="bg-primary/10 rounded-xl p-2 mr-0 sm:mr-3 mb-3 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-text font-heading">MediPredict AI</h1>
            <p className="text-text-light text-sm">Advanced Disease Prediction System</p>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden max-w-6xl mx-auto w-full p-4">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-card border border-border rounded-2xl p-6 overflow-y-auto mb-4">
            <div className="flex items-center mb-6">
              <div className="h-3 w-3 bg-primary rounded-full mr-2"></div>
              <div className="text-primary font-semibold text-sm">Chat Session</div>
            </div>
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-lg font-medium text-text">No Predictions Yet</div>
                <p className="text-muted max-w-xs mt-2 text-sm">Enter your symptoms below to get an AI-powered disease prediction</p>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3/4 rounded-2xl p-4 ${message.type === 'user' ? 'bg-primary text-white' : 'bg-surface-alt border border-border text-text'}`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center mb-2">
                          <div className="bg-primary/10 p-1 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div className="text-xs text-primary font-semibold">MediPredict AI</div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Enter symptoms separated by commas (e.g. cough, fever, headache)" className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder-muted" required />
              <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-5 rounded-xl disabled:opacity-70 transition-colors text-sm">
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Predict
                  </div>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </form>
        </div>
        <div className={`w-full md:w-96 bg-card border border-border rounded-2xl p-6 overflow-y-auto transition-all ${response ? 'opacity-100' : 'opacity-50 md:opacity-100'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-primary/10 p-2 rounded-xl mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Detailed Analysis</h2>
              <p className="text-muted text-xs">Complete prediction results</p>
            </div>
          </div>
          {response ? (
            <div className="bg-surface-alt p-5 rounded-xl border border-border">
              <div className="whitespace-pre-wrap text-sm text-text-light leading-relaxed">{formatText(response.prediction)}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-lg font-medium text-text">No Results Yet</div>
              <p className="text-muted max-w-xs mt-2 text-sm">Submit your symptoms to see a detailed prediction analysis here</p>
            </div>
          )}
          {response && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-sm font-semibold text-amber-700 mb-2">Important Notice</div>
              <p className="text-xs text-amber-600">This prediction is for educational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictionchat;
