import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Send, Clock, User, AlertTriangle, MessageSquare, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MentorMessages() {
  const { students, currentUser, mentors, messages, addMessage } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStudentId = searchParams.get('student');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(initialStudentId || null);
  const [msgText, setMsgText] = useState('');

  const myMentor = mentors?.find(m => m.email === currentUser?.email);
  const myStudents = myMentor 
    ? students.filter(s => myMentor.assignedStudents.includes(s.id))
    : students.filter(s => s.year <= 2);

  const processedStudents = myStudents
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
       const aRisk = a.riskStatus === 'Danger' ? 2 : a.riskStatus === 'At Risk' ? 1 : 0;
       const bRisk = b.riskStatus === 'Danger' ? 2 : b.riskStatus === 'At Risk' ? 1 : 0;
       return bRisk - aRisk;
    });

  const activeStudent = myStudents.find(s => s.id === activeChat);

  const chatMessages = messages
    .filter(m => 
      (m.senderId === currentUser?.id && m.receiverId === activeStudent?.id) || 
      (m.senderId === activeStudent?.id && m.receiverId === currentUser?.id)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (initialStudentId && !activeChat) {
      setActiveChat(initialStudentId);
    }
  }, [initialStudentId, activeChat]);

  const handleSend = () => {
    if (!msgText.trim() || !activeStudent || !currentUser) return;
    
    addMessage({
      senderId: currentUser.id,
      receiverId: activeStudent.id,
      title: 'Mentor xabari',
      content: msgText,
      read: false
    });
    setMsgText('');
  };

  const getDaysSince = (dateStr?: string) => {
    if (!dateStr) return Infinity;
    const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-[#E8EFED] shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
         "w-full md:w-[320px] flex-shrink-0 border-r border-[#E8EFED] flex flex-col bg-[#F9FBFA]",
         activeChat ? "hidden md:flex" : "flex"
      )}>
         <div className="p-4 border-b border-[#E8EFED] bg-white">
            <h2 className="text-[18px] font-bold text-[#0D1F1A] mb-4">Talabalar</h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
               <input 
                  type="text"
                  placeholder="Ism bo'yicha izlash..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl text-[13px] font-medium outline-none focus:border-[#0A9B82] transition-colors"
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {processedStudents.map(student => {
               const daysSince = getDaysSince(student.scores.tyutorBahosi?.lastEvaluatedAt);
               const needsEval = daysSince > 30;
               return (
                 <button 
                   key={student.id}
                   onClick={() => setActiveChat(student.id)}
                   className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left",
                      activeChat === student.id ? "bg-[#0A9B82] text-white shadow-md mx-1 w-[calc(100%-8px)]" : "hover:bg-white hover:shadow-sm text-[#0D1F1A] bg-transparent"
                   )}
                 >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 border",
                      activeChat === student.id ? "bg-white/20 border-white/20 text-white" : "bg-[#EDF7F4] border-[#0A9B82]/20 text-[#0A9B82]"
                    )}>
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-[14px] truncate">{student.name}</p>
                       <p className={cn("text-[11px] font-medium truncate mt-0.5", activeChat === student.id ? "text-emerald-100" : "text-[#6B8A80]")}>
                          {student.group} • {student.totalScore.toFixed(0)} ball
                       </p>
                    </div>
                    {(student.riskStatus !== 'Safe' || needsEval) && (
                       <div className="pt-1">
                         {student.riskStatus === 'Danger' ? (
                            <div className={cn("w-2 h-2 rounded-full", activeChat === student.id ? "bg-white" : "bg-red-500")} />
                         ) : needsEval ? (
                            <div className={cn("w-2 h-2 rounded-full", activeChat === student.id ? "bg-white" : "bg-amber-500")} />
                         ) : (
                            <div className={cn("w-2 h-2 rounded-full", activeChat === student.id ? "bg-white" : "bg-amber-400")} />
                         )}
                       </div>
                    )}
                 </button>
               )
            })}
         </div>
      </div>

      {/* Main Chat Area */}
      {activeChat && activeStudent ? (
         <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            <div className="h-[72px] border-b border-[#E8EFED] flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm z-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-[#9DB4AB]"><MessageSquare className="w-5 h-5"/></button>
                  <div className="w-10 h-10 rounded-full bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82] font-black text-sm border border-[#0A9B82]/20">
                    {activeStudent.name.charAt(0)}
                  </div>
                  <div>
                     <h2 className="font-bold text-[#0D1F1A] text-[15px]">{activeStudent.name}</h2>
                     <p className="text-[12px] text-[#6B8A80] font-medium flex items-center gap-1.5 mt-0.5">
                       {activeStudent.riskStatus === 'Safe' ? (
                          <span className="text-[#0A9B82]">Xavfsiz holatda</span>
                       ) : activeStudent.riskStatus === 'Danger' ? (
                          <span className="text-red-500 font-bold">Xavf ostida!</span>
                       ) : (
                          <span className="text-amber-500 font-bold">E'tibor bering</span>
                       )} • {activeStudent.totalScore.toFixed(0)} ball
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FCFDFD]">
               <div className="text-center">
                  <span className="bg-[#EDF7F4] text-[#0A9B82] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Bugun</span>
               </div>
               
               {chatMessages.map(msg => {
                  const isMine = msg.senderId === currentUser?.id;
                  const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={cn("flex flex-col max-w-[75%]", isMine ? "ml-auto items-end" : "mr-auto items-start")}
                     >
                        <div className={cn(
                           "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                           isMine ? "bg-[#0A9B82] text-white rounded-tr-sm" : "bg-white border border-[#E8EFED] text-[#0D1F1A] rounded-tl-sm"
                        )}>
                           {msg.content}
                        </div>
                        <span className="text-[10px] text-[#9DB4AB] font-medium mt-1 mx-1 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {timeStr}
                        </span>
                     </motion.div>
                  )
               })}
            </div>

            <div className="p-4 bg-white border-t border-[#E8EFED]">
               <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl flex items-center p-1 pl-4 focus-within:border-[#0A9B82] transition-colors focus-within:ring-2 focus-within:ring-[#0A9B82]/10">
                     <input 
                        type="text" 
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Xabar yozing..."
                        className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-[#0D1F1A] placeholder:text-[#9DB4AB] h-10"
                     />
                     <button onClick={handleSend} disabled={!msgText.trim()} className="w-10 h-10 flex items-center justify-center bg-[#0A9B82] text-white rounded-lg disabled:opacity-50 disabled:bg-[#9DB4AB] transition-all hover:bg-[#087D6A] ml-2">
                        <Send className="w-4 h-4 ml-0.5" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      ) : (
         <div className="hidden md:flex flex-1 items-center justify-center bg-[#FCFDFD]">
            <div className="text-center max-w-sm">
               <div className="w-20 h-20 bg-[#EDF7F4] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <MessageSquare className="w-8 h-8 text-[#0A9B82]" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A9B82] rounded-full border-2 border-white flex items-center justify-center"><User className="w-3 h-3 text-white" /></div>
               </div>
               <h3 className="text-xl font-bold text-[#0D1F1A] mb-2">Suhbatni boshlang</h3>
               <p className="text-[14px] text-[#6B8A80]">Chap tomondagi ro'yxatdan talabani tanlab, u bilan xabarlashing.</p>
            </div>
         </div>
      )}
    </div>
  );
}
