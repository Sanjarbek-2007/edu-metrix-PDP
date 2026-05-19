import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Filter, ArrowDownUp, AlertTriangle, MessageSquare, ExternalLink, ShieldCheck, FileSignature, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MentorStudents() {
  const { students, currentUser, mentors } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStr, setFilterStr] = useState('Barchasi'); // Barchasi, Baholash kerak, Xavf ostida, Safe
  const [sortBy, setSortBy] = useState('Ball ↓'); // Ball ↓, Ball ↑, Ism A-Z, Oxirgi baholash

  const myMentor = mentors?.find(m => m.email === currentUser?.email);
  
  const myStudents = myMentor 
    ? students.filter(s => myMentor.assignedStudents.includes(s.id))
    : students.filter(s => s.year <= 2);

  const getDaysSince = (dateStr?: string) => {
    if (!dateStr) return Infinity;
    const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const processedStudents = myStudents
    .filter(s => {
       const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
       if (!matchName) return false;
       
       const daysSince = getDaysSince(s.scores.tyutorBahosi?.lastEvaluatedAt);
       const needsEval = daysSince > 30;
       
       if (filterStr === 'Baholash kerak') return needsEval;
       if (filterStr === 'Xavf ostida') return s.riskStatus === 'Danger' || s.riskStatus === 'At Risk';
       if (filterStr === 'Safe') return s.riskStatus === 'Safe';
       return true;
    })
    .sort((a, b) => {
       if (sortBy === 'Ball ↓') return b.totalScore - a.totalScore;
       if (sortBy === 'Ball ↑') return a.totalScore - b.totalScore;
       if (sortBy === 'Ism A-Z') return a.name.localeCompare(b.name);
       if (sortBy === 'Oxirgi baholash') {
          const dA = getDaysSince(a.scores.tyutorBahosi?.lastEvaluatedAt);
          const dB = getDaysSince(b.scores.tyutorBahosi?.lastEvaluatedAt);
          return dA - dB;
       }
       return 0;
    });

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Mening talabalarim</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">{myStudents.length} ta talaba biriktirilgan</p>
        </div>
        <div className="bg-[#EDF7F4] border border-[#0A9B82]/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-[#0A9B82] text-white flex items-center justify-center font-bold text-xs shadow-sm">
             {currentUser?.name.charAt(0) || 'M'}
           </div>
           <div>
              <p className="text-[11px] font-black text-[#0A9B82] uppercase tracking-wider">Mentor</p>
              <p className="text-sm font-bold text-[#0D1F1A]">{currentUser?.name || myMentor?.name || "Asosiy Mentor"}</p>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8EFED] shadow-sm">
         <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
            <input 
               type="text"
               placeholder="Talabani izlash..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl text-[13px] font-medium outline-none focus:border-[#0A9B82] transition-colors"
            />
         </div>
         <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#9DB4AB]" />
            <select 
               value={filterStr} onChange={e => setFilterStr(e.target.value)}
               className="bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-2 px-3 text-[13px] font-bold text-[#0D1F1A] outline-none cursor-pointer"
            >
               <option>Barchasi</option>
               <option>Baholash kerak</option>
               <option>Xavf ostida</option>
               <option>Safe</option>
            </select>
         </div>
         <div className="flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-[#9DB4AB]" />
            <select 
               value={sortBy} onChange={e => setSortBy(e.target.value)}
               className="bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-2 px-3 text-[13px] font-bold text-[#0D1F1A] outline-none cursor-pointer"
            >
               <option>Ball ↓</option>
               <option>Ball ↑</option>
               <option>Ism A-Z</option>
               <option>Oxirgi baholash</option>
            </select>
         </div>
      </div>

      {processedStudents.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
               {processedStudents.map(student => {
                  const daysSince = getDaysSince(student.scores.tyutorBahosi?.lastEvaluatedAt);
                  const needsEval = daysSince > 30;
                  const isSafe = student.riskStatus === 'Safe';
                  const isDanger = student.riskStatus === 'Danger';
                  
                  return (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        key={student.id} 
                        className={cn(
                           "bg-white rounded-[20px] border shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md",
                           needsEval ? "border-amber-300" : isDanger ? "border-red-300" : "border-[#E8EFED]"
                        )}
                        style={{ borderLeftWidth: '4px', borderLeftColor: needsEval ? '#FFB800' : isDanger ? '#DC2626' : '#0A9B82' }}
                     >
                        {needsEval && (
                           <div className="absolute top-0 right-0 bg-amber-50 text-amber-600 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border-b border-l border-amber-100">
                             <AlertTriangle className="w-3 h-3" /> Baholash kerak
                           </div>
                        )}
                        <div className={cn("p-5 flex gap-4", needsEval ? "bg-amber-50/30" : "")}>
                           <div className="w-12 h-12 rounded-2xl bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82] font-black text-lg border border-[#0A9B82]/20 flex-shrink-0">
                              {student.name.charAt(0)}
                           </div>
                           <div className="flex-1 min-w-0 pr-16 border-b border-transparent">
                              <h3 className="text-sm font-bold text-[#0D1F1A] truncate">{student.name}</h3>
                              <p className="text-xs text-[#6B8A80] mt-0.5">{student.year}-kurs · {student.group}</p>
                           </div>
                        </div>

                        <div className="px-5 py-4 space-y-4 flex-1">
                           <div>
                              <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-1">
                                 <span className="text-[#9DB4AB]">Jami ball</span>
                                 <span className={cn(
                                    isSafe ? "text-[#0A9B82]" : isDanger ? "text-red-600" : "text-amber-600"
                                 )}>{student.totalScore.toFixed(0)}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={cn("h-full rounded-full", isSafe ? "bg-[#0A9B82]" : isDanger ? "bg-red-500" : "bg-amber-500")} 
                                    style={{ width: `${Math.min(100, student.totalScore)}%` }} 
                                 />
                              </div>
                           </div>
                           
                           <div>
                              <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-1">
                                 <span className="text-[#9DB4AB]">Tyutor bahosi</span>
                                 <span className="text-[#0A9B82]">{student.scores.tyutorBahosi?.value || 0} / 5</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-[#0A9B82] rounded-full" 
                                    style={{ width: `${((student.scores.tyutorBahosi?.value || 0) / 5) * 100}%` }} 
                                 />
                              </div>
                           </div>

                           <div className="pt-2 border-t border-dashed border-[#E8EFED]">
                              <p className="text-[11px] text-[#6B8A80] flex items-center gap-1.5">
                                 {needsEval ? (
                                    <>
                                       <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                       <span className="text-amber-600 font-bold">
                                          {student.scores.tyutorBahosi?.lastEvaluatedAt ? `${daysSince} kun oldin baholangan` : "Hali baholanmagan"}
                                       </span>
                                    </>
                                 ) : (
                                    <>
                                       <ShieldCheck className="w-3.5 h-3.5 text-[#0A9B82]" />
                                       <span className="text-[#0A9B82] font-bold">
                                          {daysSince === 0 ? "Bugun baholangan" : `${daysSince} kun oldin baholangan`}
                                       </span>
                                    </>
                                 )}
                              </p>
                           </div>
                        </div>

                        <div className="p-2 border-t border-[#E8EFED] bg-slate-50 flex gap-2">
                           <button 
                              onClick={() => navigate(`/mentor/students/profile/${student.id}`)}
                              className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#6B8A80] bg-white border border-[#E8EFED] hover:bg-[#F8FFFE] hover:text-[#0A9B82] hover:border-[#0A9B82]/30 transition-all"
                           >
                              <ExternalLink className="w-3 h-3" /> Ko'rish
                           </button>
                           <button 
                              onClick={() => navigate(`/mentor/evaluate/${student.id}`)}
                              className={cn(
                                 "flex-[1.5] py-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all shadow-sm",
                                 needsEval 
                                    ? "bg-[#0A9B82] text-white hover:bg-[#087D6A]" 
                                    : "bg-white border border-[#E8EFED] text-[#0D1F1A] hover:bg-[#F8FFFE]"
                              )}
                           >
                              <FileSignature className="w-3 h-3" /> Baholash
                           </button>
                           <button 
                              onClick={() => navigate(`/mentor/messages?student=${student.id}`)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6B8A80] bg-white border border-[#E8EFED] hover:bg-slate-100 transition-all flex-shrink-0"
                           >
                              <MessageSquare className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.div>
                  )
               })}
            </AnimatePresence>
         </div>
      ) : (
         <div className="bg-white rounded-3xl border border-[#E8EFED] p-12 text-center flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-[#9DB4AB]" />
             </div>
             <h3 className="text-xl font-bold text-[#0D1F1A]">Talabalar topilmadi</h3>
             <p className="text-[14px] text-[#6B8A80] mt-2 max-w-sm">
                Sizning so'rovingiz bo'yicha kiritilgan parametrlar bilan talabalar topilmadi yoki sizga hali talaba biriktirilmagan.
             </p>
         </div>
      )}
    </div>
  );
}
