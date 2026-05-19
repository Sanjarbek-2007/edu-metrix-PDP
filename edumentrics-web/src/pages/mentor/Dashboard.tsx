import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, Star, Clock, AlertTriangle, BarChart2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function MentorDashboard() {
  const { currentUser, students, mentors, tyutorEvaluations } = useAppContext();
  const navigate = useNavigate();

  const myMentor = mentors?.find(m => m.email === currentUser?.email);
  
  const myStudents = myMentor 
    ? students.filter(s => myMentor.assignedStudents.includes(s.id))
    : students.filter(s => s.year <= 2);

  const getDaysSince = (dateStr?: string) => {
    if (!dateStr) return Infinity;
    const diffTime = Math.abs(new Date().getTime() - new Date(dateStr).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const pendingEvaluations = myStudents.filter(s => {
    return getDaysSince(s.scores.tyutorBahosi?.lastEvaluatedAt) > 30;
  });

  const avgScore = myStudents.length > 0 
    ? myStudents.reduce((acc, curr) => acc + curr.totalScore, 0) / myStudents.length 
    : 0;
    
  const atRiskStudents = myStudents.filter(s => s.riskStatus === 'Danger' || s.riskStatus === 'At Risk');

  const myRecentEvaluations = tyutorEvaluations
    .filter(e => e.mentorId === (currentUser?.id || 'm1'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const today = new Date().toLocaleDateString('uz', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[28px] font-black text-[#0D1F1A] tracking-tight">Mentor paneli</h1>
          <p className="text-[15px] text-[#6B8A80] mt-1 font-medium">Talabalar rivojini kuzating va baholang</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-bold text-[#0D1F1A]">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div 
           onClick={() => navigate('/mentor/students')}
           className="bg-white p-5 rounded-[20px] border border-[#E8EFED] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#0A9B82] hover:shadow-md transition-all group"
         >
            <Users className="w-6 h-6 text-[#0A9B82] mb-4 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-[#9DB4AB] mb-1">Mening talabalarim</p>
              <p className="text-2xl font-black text-[#0D1F1A]">{myStudents.length}</p>
              <p className="text-[11px] text-[#6B8A80] font-medium mt-1">Sizga biriktirilgan</p>
            </div>
         </div>
         
         <div 
           onClick={() => navigate('/mentor/students')}
           className="bg-white p-5 rounded-[20px] border border-[#E8EFED] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#FFB800] hover:shadow-md transition-all group"
         >
            <Clock className="w-6 h-6 text-[#FFB800] mb-4 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[11px] font-black uppercase tracking-wider text-[#9DB4AB] mb-1">Baholash kutilmoqda</p>
               <p className={cn("text-2xl font-black flex items-center gap-2", pendingEvaluations.length > 0 ? "text-[#D97706]" : "text-[#0A9B82]")}>
                 {pendingEvaluations.length > 0 ? pendingEvaluations.length : "Hammasi baholangan"}
               </p>
               <p className="text-[11px] text-[#6B8A80] font-medium mt-1">30 kundan ko'p bo'ldi</p>
            </div>
         </div>

         <div className="bg-white p-5 rounded-[20px] border border-[#E8EFED] shadow-sm flex flex-col justify-between">
            <BarChart2 className="w-6 h-6 text-[#2563EB] mb-4" />
            <div>
               <p className="text-[11px] font-black uppercase tracking-wider text-[#9DB4AB] mb-1">O'rtacha ball (guruh)</p>
               <p className="text-2xl font-black text-[#0D1F1A]">{avgScore.toFixed(1)}</p>
               <p className="text-[11px] text-[#6B8A80] font-medium mt-1">Barcha talabalar o'rtachasi</p>
            </div>
         </div>

         <div 
           onClick={() => navigate('/mentor/students')}
           className={cn(
             "bg-white p-5 rounded-[20px] border shadow-sm flex flex-col justify-between cursor-pointer transition-all group",
             atRiskStudents.length > 0 ? "border-[#FECACA] hover:border-[#DC2626]" : "border-[#E8EFED]"
           )}
         >
            <AlertTriangle className="w-6 h-6 text-[#DC2626] mb-4 group-hover:scale-110 transition-transform" />
            <div>
               <p className="text-[11px] font-black uppercase tracking-wider text-[#9DB4AB] mb-1">Xavf ostidagi talabalar</p>
               <p className={cn("text-2xl font-black", atRiskStudents.length > 0 ? "text-[#DC2626]" : "text-[#0D1F1A]")}>
                 {atRiskStudents.length}
               </p>
               <p className="text-[11px] text-[#6B8A80] font-medium mt-1">E'tibor talab etadi</p>
            </div>
         </div>
      </div>

      {pendingEvaluations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FFFBEB] rounded-[24px] border border-[#FDE68A] p-6 shadow-sm">
           <h3 className="text-lg font-bold text-[#92400E] mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Zudlik bilan baholash kerak</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEvaluations.map(s => {
                const daysSince = getDaysSince(s.scores.tyutorBahosi?.lastEvaluatedAt);
                return (
                 <div key={s.id} className="bg-white rounded-xl border border-[#FDE68A] p-4 flex flex-col justify-between">
                    <div className="flex gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm flex-shrink-0">
                         {s.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-[#0D1F1A] text-sm line-clamp-1">{s.name}</p>
                         <p className="text-xs text-[#6B8A80] mt-0.5">{s.group} guruh</p>
                       </div>
                    </div>
                    <div className="flex items-end justify-between">
                       <div>
                          <p className="text-[10px] uppercase font-bold text-[#9DB4AB] mb-1">Oxirgi baholash</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block",
                            daysSince === Infinity ? "bg-red-50 text-red-600" : daysSince > 60 ? "bg-amber-100 text-amber-700" : "bg-amber-50 text-amber-600"
                          )}>
                             {daysSince === Infinity ? "Baholanmagan" : `${daysSince} kun oldin`}
                          </span>
                       </div>
                       <Link to={`/mentor/evaluate/${s.id}`} className="px-3 py-1.5 bg-[#0A9B82] text-white rounded-lg text-[11px] font-bold hover:bg-[#087D6A] shadow-sm transition-colors">
                          Baholash →
                       </Link>
                    </div>
                 </div>
                )
              })}
           </div>
        </motion.div>
      )}

      {pendingEvaluations.length === 0 && myStudents.length > 0 && (
         <div className="bg-[#EDF7F4] rounded-[20px] border border-[#A7F3D0] p-6 shadow-sm flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-[#0A9B82]" />
            <div>
               <h3 className="text-[15px] font-bold text-[#0D1F1A]">Barcha talabalar baholangan ✓</h3>
               <p className="text-xs text-[#065F46] mt-1">Sizga biriktirilgan barcha talabalar uchun oylik baholashlar to'liq kiritilgan.</p>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[24px] border border-[#E8EFED] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#E8EFED] flex justify-between items-center">
               <h3 className="font-bold text-[#0D1F1A] text-[16px]">Talabalarim holati</h3>
               <Link to="/mentor/students" className="text-[12px] font-bold text-[#0A9B82] hover:text-[#087D6A]">Barchasini ko'rish →</Link>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
               <table className="w-full text-left text-sm">
                 <thead className="bg-[#F8FFFE] text-[10px] uppercase font-black text-[#9DB4AB]">
                    <tr>
                      <th className="px-6 py-3">Talaba</th>
                      <th className="px-6 py-3">Ball</th>
                      <th className="px-6 py-3">Tyutor bahosi</th>
                      <th className="px-6 py-3">Risk</th>
                      <th className="px-6 py-3">Amal</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E8EFED]">
                    {myStudents.slice(0, 5).map(s => (
                       <tr key={s.id} className="hover:bg-[#F8FFFE]">
                         <td className="px-6 py-3">
                            <span className="font-bold text-[#0D1F1A]">{s.name}</span>
                         </td>
                         <td className="px-6 py-3">
                            <span className={cn(
                               "font-black",
                               s.riskStatus === 'Safe' ? "text-[#0A9B82]" : s.riskStatus === 'Danger' ? "text-red-600" : "text-amber-600"
                            )}>{s.totalScore.toFixed(0)}</span>
                         </td>
                         <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-[#0D1F1A]">{s.scores.tyutorBahosi?.value || 0}/5</span>
                               <span className={cn("w-2 h-2 rounded-full", s.scores.tyutorBahosi?.value >= 4 ? "bg-[#0A9B82]" : "bg-amber-400")} />
                            </div>
                         </td>
                         <td className="px-6 py-3">
                            <span className={cn(
                               "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                               s.riskStatus === 'Safe' ? "bg-emerald-50 text-[#0A9B82]" : 
                               s.riskStatus === 'At Risk' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                            )}>{s.riskStatus}</span>
                         </td>
                         <td className="px-6 py-3">
                            <button onClick={() => navigate(`/mentor/evaluate/${s.id}`)} className="text-[11px] font-bold text-[#0A9B82] bg-[#EDF7F4] px-3 py-1.5 rounded-lg hover:bg-[#0A9B82] hover:text-white transition-colors">
                               Baholash
                            </button>
                         </td>
                       </tr>
                    ))}
                    {myStudents.length === 0 && (
                       <tr><td colSpan={5} className="py-8 text-center text-sm text-[#9DB4AB]">Talabalar topilmadi</td></tr>
                    )}
                 </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white rounded-[24px] border border-[#E8EFED] shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-[#0D1F1A] text-[16px]">So'nggi baholashlarim</h3>
                 <Link to="/mentor/evaluations" className="text-[12px] font-bold text-[#0A9B82] hover:text-[#087D6A]">Barchasi →</Link>
               </div>
               <div className="space-y-4">
                  {myRecentEvaluations.map(e => {
                     const student = students.find(s => s.id === e.studentId);
                     return (
                        <div key={e.id} className="flex justify-between items-center bg-[#F9FBFA] p-3 rounded-xl border border-[#E8EFED]">
                           <div className="flex gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0A9B82] font-black text-sm border border-[#E8EFED]">
                                {student?.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-[#0D1F1A] text-[13px]">{student?.name || 'Noma\'lum'}</p>
                                 <p className="text-[11px] text-[#6B8A80] mt-0.5">Davr: {e.period} • {e.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-[#0A9B82]">{e.totalPoints.toFixed(2)}/5</p>
                              <Link to={`/mentor/students/profile/${e.studentId}`} className="text-[10px] font-bold text-[#9DB4AB] hover:text-[#0D1F1A] uppercase tracking-wider mt-1 inline-block">Ko'rish</Link>
                           </div>
                        </div>
                     )
                  })}
                  {myRecentEvaluations.length === 0 && (
                     <div className="text-center py-6">
                        <p className="text-[13px] text-[#6B8A80] mb-3">Hali baholash amalga oshirilmagan</p>
                        <Link to="/mentor/students" className="text-[12px] font-bold text-[#0A9B82] underline">Birinchi baholashni boshlash →</Link>
                     </div>
                  )}
               </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E8EFED] shadow-sm p-6">
               <h3 className="font-bold text-[#0D1F1A] text-[16px] mb-4">Tezkor amallar</h3>
               <div className="flex gap-3">
                  <button onClick={() => navigate('/mentor/students')} className="flex-1 py-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl flex flex-col items-center justify-center hover:bg-white hover:border-[#0A9B82] hover:text-[#0A9B82] transition-colors group">
                     <Users className="w-5 h-5 text-[#9DB4AB] mb-2 group-hover:text-[#0A9B82]" />
                     <span className="text-[11px] font-bold text-[#0D1F1A] group-hover:text-[#0A9B82]">Talabalarimni ko'rish</span>
                  </button>
                  <button onClick={() => navigate('/mentor/students')} className="flex-1 py-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl flex flex-col items-center justify-center hover:bg-white hover:border-[#0A9B82] hover:text-[#0A9B82] transition-colors group">
                     <Star className="w-5 h-5 text-[#9DB4AB] mb-2 group-hover:text-[#0A9B82]" />
                     <span className="text-[11px] font-bold text-[#0D1F1A] group-hover:text-[#0A9B82]">Baholash boshlash</span>
                  </button>
                  <button onClick={() => navigate('/mentor/messages')} className="flex-1 py-4 bg-[#F9FBFA] border border-[#E8EFED] rounded-xl flex flex-col items-center justify-center hover:bg-white hover:border-[#0A9B82] hover:text-[#0A9B82] transition-colors group">
                     <MessageSquare className="w-5 h-5 text-[#9DB4AB] mb-2 group-hover:text-[#0A9B82]" />
                     <span className="text-[11px] font-bold text-[#0D1F1A] group-hover:text-[#0A9B82]">Xabar yuborish</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
