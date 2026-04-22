import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Chào bạn! Mình có thể giúp gì cho bạn về shop túi mù iPhone hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Bạn là chatbot hỗ trợ khách hàng của shop bán túi mù iPhone. 
            Trả lời các câu hỏi về: nạp thẻ (cần chuyển khoản đúng nội dung hoặc nạp card),
            tỷ lệ trúng thưởng (túi mù có iPhone 15, iPad, linh vật Labubu, Bearbrick, mảnh ghép),
            cách hoạt động (chọn túi, khui quà, nhận quà hoặc mảnh ghép).
            Nếu không giải quyết được, hãy gợi ý liên hệ qua Zalo hoặc Facebook của shop.
            User: ${input}`,
          });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Xin lỗi, mình đang gặp sự cố nhỏ. Vui lòng liên hệ Facebook của shop để được hỗ trợ trực tiếp!' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, mình đang gặp sự cố nhỏ. Vui lòng liên hệ Facebook của shop để được hỗ trợ trực tiếp!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        drag
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[199] w-[350px] max-w-[90vw] h-[500px] bg-[#1e293b] rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            <div 
              className="p-4 bg-black/20 flex items-center gap-3 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-red-900" />
              </div>
              <div>
                <h4 className="font-black text-white italic tracking-tight">Hỗ Trợ Shop</h4>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Đang trực tuyến</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                      {m.role === 'user' ? <UserIcon className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                   </div>
                   <div className={`p-3 rounded-2xl max-w-[70%] text-sm font-bold ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-300 rounded-tl-none'}`}>
                      {m.text}
                   </div>
                </div>
              ))}
              {loading && (
                 <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang soạn câu trả lời...
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 bg-transparent border-white/10 text-white text-sm focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-yellow-500 text-red-900 p-2 rounded-xl disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
