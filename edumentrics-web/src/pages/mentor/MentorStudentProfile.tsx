import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, MessageSquare, Award, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MentorStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, pointChanges, tyutorEvaluations, currentUser } = useAppContext();
  
  const student = students.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'History' | 'Evaluations' | 'Chat'>('History');

  if (!student) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Talaba topilmadi</h2>
        <button onClick={() => navigate('/mentor/students')} className="mt-4 text-[#0A9B82] font-bold">Ortga qaytish</button>
      </div>
    );
  }

  const studentPointChanges = pointChanges.filter(pc => pc.studentId === student.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const myEvaluations = tyutorEvaluations.filter(e => e.studentId === student.id && e.mentorId === (currentUser?.id || 'm1')).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Chart data
  const chartData = [
    { name: 'Sent', score: 65 },
    { name: 'Okt', score: 72 },
    { name: 'Noy', score: student.scores.finalScore - 5 },
    { name: 'Dek', score: student.scores.finalScore }
  ];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-[#9DB4AB]"/></button>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Talaba profili</h1>
        </div>
        <button 
          onClick={() => navigate(`/mentor/messages?student=${student.id}`)}
          className="px-4 py-2 bg-white text-[#0D1F1A] border border-[#E8EFED] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-[#0A9B82]" /> Xabar yuborish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* LEFT COL: Main info */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#0D1F1A] to-[#1A382D] rounded-[24px] p-8 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A9B82]/20 rounded-full blur-3xl" />
               <div className="w-24 h-24 mx-auto bg-white/10 rounded-[28px] border border-white/20 flex items-center justify-center text-4xl font-black mb-6 backdrop-blur-md relative z-10 shadow-xl shadow-black/20">
                 {student.name.charAt(0)}
               </div>
               <h2 className="text-2xl font-black mb-1">{student.name}</h2>
               <p className="text-sm text-emerald-100/80 font-medium">{student.year}-kurs • {student.group}</p>
               <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-emerald-200/60 mb-1">Jami Ball</p>
                   <p className="text-3xl font-black text-[#0A9B82]">{student.scores.finalScore.toFixed(0)}</p>
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-emerald-200/60 mb-1">Status</p>
                   <p className={cn("text-xl font-black", student.riskStatus === 'Safe' ? "text-emerald-400" : student.riskStatus === 'Danger' ? "text-red-400" : "text-amber-400")}>
                     {student.riskStatus}
                   </p>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E8EFED] p-6 shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-widest text-[#9DB4AB] mb-6">Mezonlar bo'yicha (Read-only)</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Akademik', val: student.scores.akademik.value, max: 40 },
                    { label: 'Davomat', val: student.scores.davomat.value, max: 20 },
                    { label: 'Amaliy', val: student.scores.amaliy.value, max: 15 },
                    { label: 'Faollik', val: student.scores.faollik.value, max: 10 },
                    { label: 'Intizom', val: student.scores.intizom.value, max: 10 },
                    { label: 'Tyutor bahosi', val: student.scores.tyutorBahosi.value, max: 5 }
                  ].map(item => (
                    <div key={item.label}>
                       <div className="flex justify-between text-[11px] font-bold mb-1.5"><span className="text-[#374151]">{item.label}</span><span className="text-[#0D1F1A]">{item.val}/{item.max}</span></div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-[#0A9B82] rounded-full" style={{ width: `${(item.val/item.max)*100}%` }} /></div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COL: Tabs */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-2 rounded-2xl border border-[#E8EFED] flex gap-2">
               {['History', 'Evaluations', 'Chat'].map((tab) => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab as any)}
                   className={cn(
                     "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                     activeTab === tab ? "bg-[#0A9B82] text-white shadow-Sm" : "text-[#6B8A80] hover:bg-[#F8FFFE] hover:text-[#0D1F1A]"
                   )}
                 >
                   {tab === 'History' ? 'Ball tarixi' : tab === 'Evaluations' ? 'Mening baholashlarim' : 'Xabarlar'}
                 </button>
               ))}
            </div>

            <div className="bg-white rounded-[24px] border border-[#E8EFED] p-6 shadow-sm min-h-[500px]">
               <AnimatePresence mode="wait">
                  {activeTab === 'History' && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                       <h3 className="font-bold text-[#0D1F1A]">Reyting o'sish dinamikasi</h3>
                       <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData}>
                               <XAxis dataKey="name" fontSize={11} stroke="#9DB4AB" tickLine={false} axisLine={false} />
                               <YAxis fontSize={11} stroke="#9DB4AB" tickLine={false} axisLine={false} />
                               <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                               <Line type="monotone" dataKey="score" stroke="#0A9B82" strokeWidth={3} dot={{ r: 4, fill: '#0A9B82' }} activeDot={{ r: 6 }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <h3 className="font-bold text-[#0D1F1A] mt-8 mb-4 border-b border-[#E8EFED] pb-2">So'nggi o'zgarishlar</h3>
                       <div className="space-y-3">
                          {studentPointChanges.map(pc => (
                            <div key={pc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-[#E8EFED]">
                               <div>
                                  <p className="text-sm font-bold text-[#0D1F1A]">{pc.reason}</p>
                                  <p className="text-[11px] text-[#6B8A80] mt-0.5">{pc.category} • {new Date(pc.date).toLocaleDateString()}</p>
                               </div>
                               <span className={cn("text-xs font-black px-2 py-1 rounded w-max", pc.amount > 0 ? "bg-emerald-50 text-[#0A9B82]" : "bg-red-50 text-red-600")}>
                                 {pc.amount > 0 ? '+' : ''}{pc.amount}
                               </span>
                            </div>
                          ))}
                          {studentPointChanges.length === 0 && <p className="text-sm text-[#9DB4AB]">O'zgarishlar topilmadi.</p>}
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'Evaluations' && (
                    <motion.div key="evals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                       <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-[#0D1F1A]">Mening baholashlarim</h3>
                         <button onClick={() => navigate(`/mentor/evaluate/${student.id}`)} className="text-[11px] font-bold text-[#0A9B82] hover:underline">
                            Yangi baholash →
                         </button>
                       </div>
                       
                       <div className="space-y-4">
                          {myEvaluations.map(e => (
                             <div key={e.id} className="border border-[#E8EFED] rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E8EFED] border-dashed">
                                   <div>
                                      <p className="text-[14px] font-bold text-[#0D1F1A]">{e.period}</p>
                                      <p className="text-[11px] text-[#6B8A80] mt-0.5">{e.date}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-2xl font-black text-[#0A9B82]">{e.totalPoints.toFixed(2)}<span className="text-sm text-[#9DB4AB]">/5</span></p>
                                   </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                   {[
                                     { l: "Korporativ", v: e.scores.korporativMadaniyat },
                                     { l: "Ijtimoiy", v: e.scores.ijtimoiyFaollik },
                                     { l: "Soft Skills", v: e.scores.softSkills },
                                     { l: "Intizom", v: e.scores.intizom },
                                     { l: "Yotoqxona", v: e.scores.yotoqxonaHayot }
                                   ].map(score => (
                                     <div key={score.l}>
                                        <div className="flex justify-between text-[11px] font-bold mb-1"><span className="text-[#374151]">{score.l}</span><span className="text-[#0A9B82]">{score.v}/1</span></div>
                                        <div className="w-full h-1 bg-[#EDF7F4] rounded-full"><div className="h-full bg-[#0A9B82] rounded-full" style={{ width: `${score.v * 100}%` }} /></div>
                                     </div>
                                   ))}
                                </div>
                                
                                {e.notes && (
                                   <div className="bg-[#F8FFFE] p-3 rounded-xl border border-[#E8EFED]">
                                      <p className="text-[10px] uppercase font-black text-[#9DB4AB] mb-1">Izoh</p>
                                      <p className="text-[12px] font-medium text-[#374151] italic">"{e.notes}"</p>
                                   </div>
                                )}
                             </div>
                          ))}
                          {myEvaluations.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 border border-[#E8EFED] border-dashed rounded-2xl">
                               <Award className="w-8 h-8 text-[#9DB4AB] mx-auto mb-3 opacity-50" />
                               <p className="text-sm font-bold text-[#6B8A80]">Hali baholash amalga oshirmagansiz</p>
                               <button onClick={() => navigate(`/mentor/evaluate/${student.id}`)} className="mt-2 text-xs font-bold text-[#0A9B82] underline">Hozir baholash</button>
                            </div>
                          )}
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'Chat' && (
                    <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center py-20 text-center h-full min-h-[300px]">
                       <MessageSquare className="w-12 h-12 text-[#0A9B82] opacity-20 mb-4" />
                       <h3 className="font-bold text-[#0D1F1A]">Talaba bilan yozishish</h3>
                       <p className="text-[13px] text-[#6B8A80] mt-1 max-w-xs mb-4">Shaxsiy xabarlarga o'tib ushbu talaba bilan suhbatni boshlashingiz mumkin.</p>
                       <button onClick={() => navigate(`/mentor/messages?student=${student.id}`)} className="px-4 py-2 bg-[#0A9B82] text-white rounded-xl text-xs font-bold hover:bg-[#087D6A] transition-colors">Xabarlarga o'tish</button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
}
