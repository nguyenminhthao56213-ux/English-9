
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, Bot, Sparkles } from 'lucide-react';
import { getAIInstance } from '../services/geminiService';
import { Message } from '../types';
import { marked } from 'marked';

const Tutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: 'Chào em! Anh là gia sư AI E-Tutor. Hôm nay em cần hỗ trợ gì về ngữ pháp hay từ vựng lớp 9 nào?' }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = getAIInstance();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Bạn là gia sư tiếng Anh chuyên nghiệp, nhiệt tình, dành cho học sinh lớp 9 tại Việt Nam. 
          Sử dụng chương trình Global Success. Giải thích dễ hiểu, dùng ngôn ngữ học sinh. 
          Khuyến khích học sinh tự tìm câu trả lời bằng cách đặt gợi ý trước khi giải bài.`,
        }
      });

      // Simple implementation: send history
      // Note: for real apps, we'd handle tokens and history limits
      const response = await chat.sendMessage({ message: input });
      const modelMsg: Message = { role: 'model', parts: [{ text: response.text }] };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Ôi, anh bị "lag" một chút. Em nói lại được không?' }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <Bot size={28} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Gia sư AI 24/7</h3>
          <p className="text-xs text-blue-100">Sẵn sàng hỗ trợ mọi thắc mắc của em</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={`p-5 rounded-3xl text-gray-800 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200' : 'bg-gray-50 rounded-tl-none shadow-sm'} shadow-md`}>
                <div 
                  className="prose prose-sm max-w-none prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.parts[0].text || '') }}
                />
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-orange-600" />
              <span className="text-sm font-medium text-gray-500">Gia sư đang gõ...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-inner border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ví dụ: Cách dùng Relative Clauses?..."
            className="flex-1 px-4 py-2 border-none focus:ring-0 bg-transparent text-lg"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-primary text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
