import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { History, TrendingUp, Clock, Shield, Award, ChevronDown, ChevronUp, Star, UserCheck, Briefcase, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Student } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentScores() {
  const { currentUser, pointChanges } = useAppContext();
  const student = currentUser as Student;
  const [activeTab, setActiveTab] = useState<'asosiy' | 'bonus' | 'tarix'>('asosiy');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const studentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = [
    {
      id: 'akademik',
      icon: <Award className="w-6 h-6" />,
      title: 'Akademik natija',
      value: student.scores.akademik.value,
      max: student.scores.akademik.max,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm font-medium text-slate-600">
          <div className="flex justify-between items-center"><span className="text-[#6B8A80]">O'rtacha ball (GPA)</span><span className="font-bold text-[#0D1F1A]">{student.scores.akademik.gpa}% {student.scores.akademik.gpaWarning ? '⚠️' : '✅'}</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6B8A80]">Manba</span><span className="font-bold text-[#0D1F1A] shadow-sm px-2 py-1 bg-slate-50 rounded-lg">LMS (Avtomatik)</span></div>
        </div>
      )
    },
    {
      id: 'davomat',
      icon: <Clock className="w-6 h-6" />,
      title: 'Davomat',
      value: student.scores.davomat.value,
      max: student.scores.davomat.max,
      color: 'bg-[#F4F7F6] text-[#0A9B82] border-[#E8EFED]',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm font-medium text-slate-600">
          <div className="flex justify-between items-center"><span className="text-[#6B8A80]">Umumiy qatnashish</span><span className="font-bold text-[#0A9B82] bg-[#EDF7F4] px-2 py-1 rounded">{student.scores.davomat.percentage}%</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6B8A80]">Manba</span><span className="font-bold text-[#0EFFD] shadow-sm px-2 py-1 bg-[#F9FBFA] rounded-lg">LMS (Avtomatik)</span></div>
        </div>
      )
    },
    {
      id: 'amaliy',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Amaliy ko\'nikmalar',
      value: student.scores.amaliy.value,
      max: student.scores.amaliy.max,
      color: 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm font-medium text-slate-600">
          {student.scores.amaliy.subjects.map((sub, i) => (
             <div key={i} className="flex justify-between items-center border-b border-[#E8EFED] border-dashed last:border-0 pb-2 last:pb-0">
               <span className="text-[#6B8A80]">{sub.name}</span>
               <span className="font-bold text-[#0D1F1A] px-2 py-1 bg-[#F8FFFE] rounded-lg border border-[#E8EFED]">{sub.score} / {sub.max}</span>
             </div>
          ))}
        </div>
      )
    },
    {
      id: 'faollik',
      icon: <Star className="w-6 h-6" />,
      title: 'Faollik',
      value: student.scores.faollik.value,
      max: student.scores.faollik.max,
      color: 'bg-[#F5F3FF] text-[#8B5CF6] border-[#EDE9FE]',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm font-medium text-[#6B8A80]">
           <div className="flex justify-between items-center"><span className="text-[#6B8A80]">Guruh ishlari</span><span className="font-bold text-[#0D1F1A]">6 / 10</span></div>
           <div className="flex justify-between items-center"><span className="text-[#6B8A80]">Tadbirlar</span><span className="font-bold text-[#0D1F1A]">10 / 10</span></div>
        </div>
      )
    },
    {
      id: 'intizom',
      icon: <Shield className="w-6 h-6" />,
      title: 'Intizom',
      value: student.scores.intizom.value,
      max: student.scores.intizom.max,
      color: 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm font-medium text-[#6B8A80]">
           {student.scores.bonus.jarimalar.history?.map((v, i) => (
              <div key={i} className="flex flex-col border-b border-[#E8EFED] border-dashed last:border-0 pb-2 last:pb-0 group">
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-[#DC2626] group-hover:underline cursor-pointer">{v.date}</span>
                    <span className="font-black text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded">-{Math.abs(v.points)} ball</span>
                 </div>
                 <span className="text-[11px] text-[#6B8A80] mt-1">{v.type}: {v.reason}</span>
              </div>
           ))}
           {(student.scores.bonus.jarimalar.history?.length || 0) === 0 && <span className="text-[#0A9B82] font-bold">Qoidabuzarliklar yo'q</span>}
        </div>
      )
    },
    {
      id: 'tyutorBahosi',
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Tyutor bahosi',
      value: student.scores.tyutorBahosi.value,
      max: student.scores.tyutorBahosi.max,
      color: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      expandedContent: (
        <div className="space-y-3 mt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B8A80]">Baholagan:</span>
            <span className="font-bold text-[#0D1F1A]">{student.scores.tyutorBahosi.lastEvaluatedBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B8A80]">Sana:</span>
            <span className="font-bold text-[#0D1F1A]">{student.scores.tyutorBahosi.lastEvaluatedAt}</span>
          </div>
          {Object.entries(student.scores.tyutorBahosi.breakdown).map(([key, val]) => (
            <div key={key} className="flex justify-between border-b border-[#E8EFED] border-dashed pb-1">
              <span className="capitalize text-[#6B8A80]">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="font-bold text-[#0D1F1A]">{val} / 1</span>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Mening ballarim</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Joriy semestr uchun barcha ballaringiz tarixi</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0A9B82] to-[#0D1F1A] rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="absolute top-0 right-0 p-8 opacity-10 blur-2xl">
           <Award className="w-64 h-64 text-white" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-10 mix-blend-overlay">
           <svg width="200" height="200" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="5 5"/></svg>
        </div>

        <div className="relative z-10 flex flex-col items-center md:items-start text-white">
           <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-2xl text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-6 border border-white/10 hidden md:inline-block">Umumiy reyting</span>
           <div className="flex items-end gap-2">
              <span className="text-7xl md:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-lg">{student.scores.finalScore}</span>
              <span className="text-2xl md:text-3xl font-bold text-[#9DB4AB] mb-2">/ 100</span>
           </div>
           
           <div className="mt-8 flex gap-6 text-emerald-50">
              <div>
                 <p className="text-[11px] font-black uppercase tracking-widest text-[#9DB4AB] mb-1">Grant</p>
                 <p className="text-lg font-bold">{student.scores.finalScore >= 80 ? 'Saqlanadi' : 'Xavf ostida'}</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                 <p className="text-[11px] font-black uppercase tracking-widest text-[#9DB4AB] mb-1">Guruh Rangi</p>
                 <p className={cn("text-lg font-white font-bold px-3 py-0.5 rounded-lg text-center", student.scores.finalScore >= 90 ? 'bg-amber-400 text-amber-900 border border-amber-300' : 'bg-emerald-400 text-emerald-900 border border-emerald-300')}>Golden Mind</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[24px] w-full md:w-auto text-white shadow-xl shadow-black/20">
           <h3 className="text-sm font-bold opacity-80 mb-4 inline-flex items-center gap-2"><RefreshCw className="w-4 h-4 opacity-50" /> Rivojlanish grafik ko'rinishi</h3>
           <div className="flex items-end gap-2 h-32 w-full md:w-64 mb-2 border-b border-white/20 pb-2 px-2">
              {[60, 65, 70, 75, 80, 85, 88].map((h, i) => (
                 <div key={i} className="w-1/6 bg-gradient-to-t from-emerald-400 to-[#EDF7F4] rounded-t-sm" style={{height: `${h}%`}}></div>
              ))}
           </div>
           <div className="flex justify-between px-2 text-[10px] font-bold text-white/50"><span>Sen</span><span>Okt</span><span>Noy</span><span>Dek</span><span>Yan</span><span>Fev</span><span>Mar</span></div>
        </div>
      </div>

      <div className="flex bg-[#F4F7F6] p-1.5 rounded-2xl w-full max-w-[400px]">
        <button onClick={() => setActiveTab('asosiy')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all", activeTab === 'asosiy' ? "bg-white text-[#0A9B82] shadow-sm" : "text-[#9DB4AB] hover:text-[#6B8A80]")}>Asosiy {student.scores.finalScore}</button>
        <button onClick={() => setActiveTab('bonus')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all", activeTab === 'bonus' ? "bg-white text-[#0A9B82] shadow-sm" : "text-[#9DB4AB] hover:text-[#6B8A80]")}>Bonus <span className="opacity-50">+15 max</span></button>
        <button onClick={() => setActiveTab('tarix')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all", activeTab === 'tarix' ? "bg-white text-[#0A9B82] shadow-sm" : "text-[#9DB4AB] hover:text-[#6B8A80]")}>Tarix</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'asosiy' && (
          <motion.div key="asosiy" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
               const percentage = (cat.value / cat.max) * 100;
               const isExpanded = expandedCard === cat.id;

               return (
                  <div key={cat.id} className="bg-white rounded-[24px] p-6 border border-[#E8EFED] shadow-sm flex flex-col hover:border-[#0A9B82]/20 hover:shadow-lg transition-all group overflow-hidden relative">
                     <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", cat.color)}>{cat.icon}</div>
                        <div className="text-right">
                           <p className="text-[28px] font-black text-[#0D1F1A] leading-none mb-1">{cat.value}</p>
                           <p className="text-[11px] font-black uppercase tracking-widest text-[#9DB4AB]">/ {cat.max} ball {cat.id === 'intizom' && (cat.value < 10) && <span className="text-[#DC2626]">⚠️</span>}</p>
                        </div>
                     </div>

                     <div className="relative z-10">
                        <h3 className="text-lg font-bold text-[#0D1F1A] mb-4">{cat.title}</h3>
                        <div className="w-full h-2 bg-[#F4F7F6] rounded-full overflow-hidden">
                           <div className={cn("h-full rounded-full transition-all duration-1000", cat.id === 'intizom' && percentage < 100 ? "bg-[#DC2626]" : "bg-[#0A9B82]")} style={{ width: `${percentage}%` }}></div>
                        </div>
                     </div>

                     <AnimatePresence>
                        {isExpanded && (
                           <motion.div initial={{height:0, opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden mt-4 pt-4 border-t border-[#E8EFED] border-dashed">
                              {cat.expandedContent}
                           </motion.div>
                        )}
                     </AnimatePresence>

                     <button onClick={() => setExpandedCard(isExpanded ? null : cat.id)} className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center text-[#0A9B82]">
                        {isExpanded ? <ChevronUp className="w-6 h-6 bg-white rounded-full shadow-sm" /> : <ChevronDown className="w-6 h-6 bg-white rounded-full shadow-sm" />}
                     </button>
                  </div>
               )
            })}
          </motion.div>
        )}

        {activeTab === 'bonus' && (
           <motion.div key="bonus" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm relative overflow-hidden group hover:border-[#0A9B82]/20 transition-colors">
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600"><Star className="w-7 h-7" /></div>
                    <div>
                       <h3 className="text-xl font-bold text-[#0D1F1A]">Sertifikatlar va Yutuqlar</h3>
                       <p className="text-[13px] text-[#6B8A80] font-medium">+10 gacha bonus ball olish mumkin</p>
                    </div>
                 </div>
                 <div className="text-4xl font-black text-indigo-600 mb-6">{student.scores.faollik.value} <span className="text-lg text-indigo-300">/ 10</span></div>
                 <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center p-3 bg-[#F4F7F6] rounded-xl"><span className="text-sm font-bold text-[#374151]">IELTS 7.5</span><span className="font-black text-[#0A9B82]">+3 ball</span></div>
                    <div className="flex justify-between items-center p-3 bg-[#F4F7F6] rounded-xl"><span className="text-sm font-bold text-[#374151]">IT Park Hackathon 1-o'rin</span><span className="font-black text-[#0A9B82]">+2 ball</span></div>
                 </div>
              </div>
              
              <div className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm relative overflow-hidden group hover:border-[#0A9B82]/20 transition-colors">
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-600"><Briefcase className="w-7 h-7" /></div>
                    <div>
                       <h3 className="text-xl font-bold text-[#0D1F1A]">Bandlik (Ishga joylashish)</h3>
                       <p className="text-[13px] text-[#6B8A80] font-medium">+10 bonus ball olish mumkin</p>
                    </div>
                 </div>
                 <div className="text-4xl font-black text-[#D97706] mb-6">0 <span className="text-lg text-[#D97706]/40">/ 10</span></div>
                 <div className="p-4 border-2 border-dashed border-[#E8EFED] rounded-xl text-center bg-[#F9FBFA]">
                    <p className="text-sm font-bold text-[#9DB4AB]">Faol shartnomalar yo'q.</p>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'tarix' && (
           <motion.div key="tarix" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
              <div className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm">
                 <h3 className="font-bold text-[#0D1F1A] text-lg mb-6 flex items-center gap-2"><History className="w-5 h-5" /> Barcha o'zgarishlar tarixi</h3>
                 <div className="space-y-4">
                    {studentChanges.map((change) => (
                       <div key={change.id} className="flex justify-between items-center p-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl">
                          <div>
                             <p className="font-bold text-[#0D1F1A]">{change.reason}</p>
                             <div className="flex gap-4 mt-1 text-xs">
                                <span className="font-black uppercase text-[#9DB4AB] tracking-widest">{change.category}</span>
                                <span className="text-[#6B8A80]">Sana: {change.date}</span>
                             </div>
                          </div>
                          <span className={cn(
                             "px-4 py-2 rounded-xl font-black min-w-[80px] text-center",
                             change.amount > 0 ? "bg-[#EDF7F4] text-[#0A9B82]" : "bg-[#FEF2F2] text-[#DC2626]"
                          )}>
                             {change.amount > 0 ? '+' : ''}{change.amount}
                          </span>
                       </div>
                    ))}
                    {studentChanges.length === 0 && <p className="text-center text-[#9DB4AB] font-medium py-8">Tarix bo'sh</p>}
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
