import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MessageSquare, Search, Send, User, ChevronRight, Hash } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Messages() {
  const { messages, students } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredMessages = messages.filter(m => {
    const student = students.find(s => s.id === m.studentId);
    const studentName = student?.name || '';
    return (
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [isTyping, setIsTyping] = useState(false);

  const activeMessage = messages.find(m => m.id === selectedMessageId);
  const activeStudent = activeMessage ? students.find(s => s.id === activeMessage.studentId) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedMessageId]);

  const handleSend = () => {
    if (!reply.trim()) return;
    setIsTyping(true);
    // Mimic real behavior
    setReply('');
    setTimeout(() => {
      setIsTyping(false);
      scrollToBottom();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Xabarlar</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Talabalar bilan muloqot va so'rovlar nazorati</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Sidebar: Message List */}
        <div className="hidden md:flex w-80 lg:w-96 flex-col bg-white rounded-[20px] border border-[#E8EFED] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-[#E8EFED] bg-white">
            <h3 className="text-[17px] font-bold text-[#0D1F1A] mb-4">Suhbatlar</h3>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DB4AB] transition-colors group-focus-within:text-[#0A9B82]" />
              <input 
                type="text" 
                placeholder="Talabani qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-[#F4F7F6] border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A9B82]/20 transition-all text-[#0D1F1A] font-medium"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredMessages.map(m => {
              const s = students.find(st => st.id === m.studentId);
              const isActive = selectedMessageId === m.id;
              return (
                <button 
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={cn(
                    "w-full p-4 px-5 flex gap-4 transition-all text-left relative items-center border-b border-transparent",
                    isActive ? "bg-[#F0F9F7]" : "hover:bg-[#F8FFFE] border-b-[#F4F7F6]/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A9B82] to-[#0A9B82]/60 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {s?.name?.charAt(0)}
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0A9B82] rounded-full border-2 border-white flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-[#0D1F1A] text-[14px] truncate">{s?.name || 'Talaba'}</span>
                      <span className="text-[10px] font-bold text-[#9DB4AB] whitespace-nowrap ml-2 uppercase tracking-tight">
                        {new Date(m.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className={cn("text-[12px] font-bold truncate", isActive ? "text-[#0A9B82]" : "text-[#6B8A80]")}>
                      {m.subject}
                    </p>
                    <p className="text-[11px] text-[#9DB4AB] truncate mt-0.5 font-medium">{m.content}</p>
                  </div>
                  {isActive && <div className="absolute right-0 top-[20%] bottom-[20%] w-1 bg-[#0A9B82] rounded-l-full shadow-[0_0_10px_rgba(10,155,130,0.3)]" />}
                </button>
              );
            })}
            {filteredMessages.length === 0 && (
              <div className="p-12 text-center text-[#9DB4AB]">
                <div className="w-16 h-16 bg-[#F4F7F6] rounded-full flex items-center justify-center mx-auto mb-4 scale-90 opacity-50">
                   <MessageSquare className="w-8 h-8 opacity-40 text-[#0A9B82]" />
                </div>
                <p className="text-[13px] font-bold text-[#6B8A80]">Xabarlar topilmadi</p>
                <p className="text-[11px] text-[#9DB4AB] mt-1 font-medium">Qidiruv parametrlarini tekshiring</p>
              </div>
            )}
          </div>
        </div>

        {/* Content: Conversation */}
        <div className="flex-1 bg-white rounded-[20px] border border-[#E8EFED] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 bg-[#F8FFFE]/30 pointer-events-none opacity-50 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(#0A9B82 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
          
          {activeMessage ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-[#E8EFED] flex justify-between items-center bg-white/80 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDF7F4] flex items-center justify-center font-black text-[#0A9B82] border-2 border-[#0A9B82]/10 transition-transform active:scale-95 shadow-sm">
                      {activeStudent?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0A9B82] rounded-full border-2 border-white shadow-sm" title="Online" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#0D1F1A] text-[16px] leading-tight">{activeStudent?.name}</h3>
                      <span className="px-2 py-0.5 bg-[#EDF7F4] text-[#0A9B82] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#0A9B82]/10">Active</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <button 
                        onClick={() => navigate(`/admin/students/profile/${activeStudent?.id}`)}
                        className="text-[11px] text-[#0A9B82] font-bold hover:underline cursor-pointer uppercase tracking-tight"
                      >
                        {activeStudent?.group} • Profil
                      </button>
                      <span className="w-1 h-1 rounded-full bg-[#9DB4AB]" />
                      <p className="text-[11px] font-bold text-[#6B8A80] truncate max-w-[200px]">Mavzu: {activeMessage.subject}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2.5 bg-[#F4F7F6] text-[#6B8A80] hover:text-[#0A9B82] hover:bg-[#EDF7F4] rounded-xl transition-all shadow-sm">
                      <Hash className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar relative z-10">
                {/* Date Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-[#F4F7F6]" />
                  <span className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-[0.2em]">{new Date(activeMessage.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}</span>
                  <div className="flex-1 h-px bg-[#F4F7F6]" />
                </div>

                {/* Student's Message (Incoming) */}
                <div className="flex gap-4 max-w-[85%] group">
                  <div className="w-9 h-9 rounded-2xl bg-white border border-[#E8EFED] flex items-center justify-center text-[#9DB4AB] shrink-0 self-end mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <div className="bg-white border border-[#E8EFED] p-4 px-5 rounded-[4px_24px_24px_24px] shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[14px] text-[#0D1F1A] leading-relaxed font-medium">{activeMessage.content}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-2">
                        <span className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-widest">Sent · {new Date(activeMessage.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Message (Outgoing - Mock Response) */}
                <div className="flex gap-4 max-w-[85%] self-end flex-row-reverse ml-auto group">
                   <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0A9B82] to-[#0D1F1A] flex items-center justify-center text-white shrink-0 self-end mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-[#0A9B82] p-4 px-5 rounded-[24px_24px_4px_24px] shadow-[0_4px_12px_rgba(10,155,130,0.15)] group-hover:shadow-[0_4px_20px_rgba(10,155,130,0.25)] transition-all">
                      <p className="text-[14px] text-white leading-relaxed font-semibold">Xabar qabul qilindi. Sizning so'rovingiz ko'rib chiqilmoqda va tez orada batafsil javob beriladi.</p>
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                      <span className="text-[10px] font-black text-[#0A9B82] uppercase tracking-[0.1em]">ADMIN · READ</span>
                    </div>
                  </div>
                </div>

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 max-w-[85%] self-end flex-row-reverse ml-auto items-center pr-14"
                  >
                    <div className="bg-[#EDF7F4] px-4 py-2 rounded-2xl flex items-center gap-1.5 border border-[#0A9B82]/20">
                      <div className="w-1.5 h-1.5 bg-[#0A9B82] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#0A9B82] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-1.5 h-1.5 bg-[#0A9B82] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#0A9B82] uppercase tracking-widest">Yozilmoqda...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-[#E8EFED] bg-white relative z-10">
                <div className="relative flex items-end gap-3 bg-[#F4F7F6]/50 border-2 border-transparent rounded-[24px] p-2 pr-3 focus-within:border-[#0A9B82]/10 focus-within:bg-white focus-within:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-[#EDF7F4] text-[#0A9B82] rounded-2xl">
                    <User className="w-5 h-5" />
                  </div>
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Talabaga javob xabarini kiriting..."
                    rows={1}
                    className="flex-1 bg-transparent border-none py-3.5 px-3 text-[14px] focus:outline-none transition-all resize-none font-semibold min-h-[52px] max-h-[140px] custom-scrollbar text-[#0D1F1A] placeholder:text-[#9DB4AB]"
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!reply.trim() || isTyping}
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95",
                      reply.trim() && !isTyping
                        ? "bg-[#0A9B82] text-white shadow-[#0A9B82]/30 hover:shadow-[#0A9B82]/50 hover:-translate-y-0.5" 
                        : "bg-[#F3F4F6] text-[#9DB4AB] shadow-none"
                    )}
                  >
                    <Send className={cn("w-5 h-5 transition-transform", reply.trim() && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#9DB4AB] p-20 gap-4">
              <div className="w-20 h-20 bg-[#F8FFFE] rounded-full flex items-center justify-center border border-[#E8EFED]">
                <MessageSquare className="w-10 h-10 text-[#0A9B82] opacity-40" />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-[#0D1F1A]">Muloqotni boshlang</h4>
                <p className="text-[13px] font-medium text-[#6B8A80] mt-1 max-w-[280px]">Mavjud so'rovlar bilan tanishish uchun chap tarafdagi ro'yxatdan xabar tanlang</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
