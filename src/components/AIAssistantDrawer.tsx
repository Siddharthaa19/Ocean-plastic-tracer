import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, User } from 'lucide-react';
import { ASSISTANT_FAQ } from '../data/mockData';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your DRIFT-LENS Marine Intelligence Assistant. Ask me about satellite debris detections, ocean current drift predictions, or field verification targets.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAskQuestion = (q: string, a: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'ai', text: a },
    ]);
  };

  const handleSendCustom = () => {
    if (!inputValue.trim()) return;
    const q = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: q },
      {
        sender: 'ai',
        text: `Based on the latest Sentinel-2 pass and ocean current model, "${q}" indicates high marine debris concentration along the Kerala Shelf (86% confidence). Recommended action: Deploy field verification asset VER-101.`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#062B5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0878D1] to-[#24C6C5] flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-none">DRIFT-LENS Assistant</div>
              <div className="text-[10px] text-[#24C6C5] font-semibold mt-1">
                Copernicus & GFS Integration
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-[#EAF8FA] border-b border-[#24C6C5]/30">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#0878D1] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#24C6C5]" />
            Suggested Questions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ASSISTANT_FAQ.map((faq: { question: string; answer: string }, i: number) => (
              <button
                key={i}
                onClick={() => handleAskQuestion(faq.question, faq.answer)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-[#0878D1] hover:text-[#0878D1] transition-all text-left shadow-2xs cursor-pointer"
              >
                {faq.question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#0878D1] text-white'
                    : 'bg-[#062B5C] text-[#24C6C5]'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0878D1] text-white font-medium rounded-tr-none'
                    : 'bg-[#F5F9FC] text-[#071A33] border border-slate-200 rounded-tl-none font-normal'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
            placeholder="Ask about drift, targets, ocean physics..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0878D1] bg-slate-50"
          />
          <button
            onClick={handleSendCustom}
            className="p-2 rounded-xl bg-[#0878D1] text-white hover:bg-[#0766B3] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
