import React, { useState } from "react";
import { ai_api } from "../../axios.config.js";

const DoctorInsightsChat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatResponseText = (text) => {
    if (!text) return "No response received";
    try {
      if (typeof text === "string" && (text.startsWith("{") || text.startsWith("["))) {
        const jsonObj = JSON.parse(text);
        if (jsonObj.answer) return jsonObj.answer.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").replace(/\*/g, "").replace(/\\"/g, '"');
        return JSON.stringify(jsonObj, null, 2);
      }
      return text.replace(/\*/g, "");
    } catch { return text.replace(/\*/g, ""); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const newUserMessage = { id: Date.now(), text: question, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    try {
      const res = await ai_api.post("/doctor_insights", { question });
      const data = res.data;
      let formattedResponse = data?.response ? formatResponseText(data.response) : formatResponseText(JSON.stringify(data));
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: formattedResponse, sender: "bot" }]);
      setQuestion("");
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: `Error connecting to the server: ${error.message}`, sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-surface overflow-hidden">
      <header className="bg-card border-b border-border text-text px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-text font-heading">Doctor Insights</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
        <div className="mx-auto space-y-3 sm:space-y-6 max-w-lg w-full">
          {messages.length === 0 ? (
            <div className="text-center text-muted py-6 sm:py-10">
              <p className="text-base sm:text-lg font-medium">Ask a question to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm max-w-full sm:max-w-3/4 text-sm sm:text-base ${message.sender === "user" ? "bg-primary text-white" : "bg-card text-text border border-border"}`}>
                  <pre className="whitespace-pre-wrap font-sans overflow-x-auto">{message.text}</pre>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card text-text rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm border border-border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-card border-t border-border px-2 sm:px-4 py-3 sm:py-4">
        <form onSubmit={handleSubmit} className="mx-auto flex gap-2 max-w-lg w-full px-1 sm:px-2">
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-border bg-surface text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base placeholder-muted" placeholder="Ask a question..." disabled={loading} />
          <button type="submit" className="bg-primary text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl hover:bg-primary-dark focus:outline-none transition-colors disabled:opacity-50 text-sm sm:text-base font-medium" disabled={loading || !question.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default DoctorInsightsChat;
