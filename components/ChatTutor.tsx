import React, { useState, useRef, useEffect } from 'react';
import { createTutorChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2, Sparkles, X } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

interface ChatTutorProps {
  onClose: () => void;
  apiKey: string;
}

const ChatTutor: React.FC<ChatTutorProps> = ({ onClose, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Halo! Saya Pak Budi. Ada pelajaran matematika yang bikin kamu bingung hari ini? Yuk cerita, Bapak bantu jelaskan! 😊',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Use a ref to persist the chat session across renders
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session once with the provided apiKey
    if (!chatSessionRef.current) {
      chatSessionRef.current = createTutorChat(apiKey);
    }
    scrollToBottom();
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chat = chatSessionRef.current;
      const result = await chat.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add a placeholder message for streaming
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Waduh, koneksi internet Pak Budi agak putus-putus nih. Coba tanya lagi ya? 😅",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-white ring-4 ring-blue-200">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 px-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pak Budi</h3>
              <p className="text-blue-200 text-xs font-medium">Guru Matematika AI</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                }`}
              >
                 {msg.role === 'model' && (
                    <div className="text-xs font-bold text-blue-600 mb-1 flex items-center">
                        <Sparkles size={12} className="mr-1" /> Pak Budi
                    </div>
                 )}
                 <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                   {msg.text}
                 </p>
              </div>
            </div>
          ))}
          
          {isTyping && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
               <div className="bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin" />
                 <span className="text-xs font-medium">Pak Budi sedang mengetik...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya soal matematika di sini..."
              disabled={isTyping}
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
            >
              <Send size={24} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI bisa salah. Selalu cek kembali jawabanmu ya!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;