import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Download, Filter, Search, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function MentorEvaluations() {
  const { tyutorEvaluations, students, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [periodFilter, setPeriodFilter] = useState('Barcha semestr');
  const [studentFilter, setStudentFilter] = useState('Barchasi');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myEvaluations = tyutorEvaluations
    .filter(e => e.mentorId === (currentUser?.id || 'm1'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const uniquePeriods = Array.from(new Set(myEvaluations.map(e => e.period)));
  const uniqueStudents = Array.from(new Set(myEvaluations.map(e => e.studentId))).map(id => students.find(s => s.id === id)).filter(Boolean);

  const filteredEvals = myEvaluations.filter(e => {
    if (periodFilter !== 'Barcha semestr' && e.period !== periodFilter) return false;
    if (studentFilter !== 'Barchasi' && e.studentId !== studentFilter) return false;
    return true;
  });

  const handleExport = () => {
    toast.success("Excel fayl yuklanmoqda...");
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-[#9DB4AB]"/></button>
          <div>
            <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Baholash tarixi</h1>
            <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Barcha amalga oshirilgan tyutor baholar</p>
          </div>
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-white border border-[#E8EFED] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4 text-[#0A9B82]" /> Excel yuklab olish
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8EFED] shadow-sm">
         <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Filter className="w-4 h-4 text-[#9DB4AB] ml-2" />
            <select 
               value={periodFilter} onChange={e => setPeriodFilter(e.target.value)}
               className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-2 px-3 text-[13px] font-bold text-[#0D1F1A] outline-none cursor-pointer"
            >
               <option>Barcha semestr</option>
               {uniquePeriods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
         </div>
         <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <select 
               value={studentFilter} onChange={e => setStudentFilter(e.target.value)}
               className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-2 px-3 text-[13px] font-bold text-[#0D1F1A] outline-none cursor-pointer"
            >
               <option>Barchasi</option>
               {uniqueStudents.map(s => s && <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
         </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8EFED] shadow-sm overflow-hidden">
         {filteredEvals.length > 0 ? (
           <table className="w-full text-left">
              <thead className="bg-[#F8FFFE] border-b border-[#E8EFED] text-[10px] uppercase font-black text-[#9DB4AB] tracking-wider">
                 <tr>
                    <th className="px-6 py-4">Talaba</th>
                    <th className="px-6 py-4">Davr</th>
                    <th className="px-6 py-4">Sana</th>
                    <th className="px-6 py-4 text-right">Jami Ball</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFED]">
                 {filteredEvals.map(ev => {
                    const student = students.find(s => s.id === ev.studentId);
                    const isExpanded = expandedId === ev.id;
                    return (
                       <React.Fragment key={ev.id}>
                          <tr 
                             onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                             className={cn("cursor-pointer transition-colors", isExpanded ? "bg-[#F8FFFE]" : "hover:bg-slate-50")}
                          >
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82] font-black text-xs">
                                   {student?.name.charAt(0)}
                                 </div>
                                 <span className="font-bold text-[#0D1F1A] text-sm">{student?.name || 'Noma\'lum'}</span>
                               </div>
                             </td>
                             <td className="px-6 py-4 text-[13px] font-bold text-[#6B8A80]">{ev.period}</td>
                             <td className="px-6 py-4 text-[13px] font-medium text-[#9DB4AB]">{ev.date}</td>
                             <td className="px-6 py-4 text-right text-[15px] font-black text-[#0A9B82]">{ev.totalPoints.toFixed(2)} / 5</td>
                          </tr>
                          {isExpanded && (
                             <tr>
                                <td colSpan={4} className="p-0 border-b border-[#E8EFED]">
                                   <div className="bg-[#F8FFFE] p-6 shadow-inner border-y border-[#E8EFED] border-dashed">
                                       <div className="grid grid-cols-5 gap-4">
                                          {[
                                            { l: "Korporativ", v: ev.scores.korporativMadaniyat },
                                            { l: "Ijtimoiy", v: ev.scores.ijtimoiyFaollik },
                                            { l: "Soft Skills", v: ev.scores.softSkills },
                                            { l: "Intizom", v: ev.scores.intizom },
                                            { l: "Yotoqxona", v: ev.scores.yotoqxonaHayot }
                                          ].map(score => (
                                            <div key={score.l} className="bg-white p-3 rounded-xl border border-[#E8EFED]">
                                               <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-1">{score.l}</p>
                                               <p className="text-lg font-black text-[#0D1F1A]">{score.v.toFixed(2)}</p>
                                            </div>
                                          ))}
                                       </div>
                                       {ev.notes && (
                                         <div className="mt-4 p-4 bg-white rounded-xl border border-[#E8EFED]">
                                            <p className="text-[10px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-1">Izoh</p>
                                            <p className="text-[13px] font-medium text-[#374151]">"{ev.notes}"</p>
                                         </div>
                                       )}
                                   </div>
                                </td>
                             </tr>
                          )}
                       </React.Fragment>
                    )
                 })}
              </tbody>
           </table>
         ) : (
           <div className="p-12 text-center flex flex-col items-center">
               <Award className="w-12 h-12 text-[#9DB4AB] opacity-20 mb-4" />
               <h3 className="text-lg font-bold text-[#0D1F1A]">Ma'lumot topilmadi</h3>
               <p className="text-[13px] text-[#6B8A80] mt-1">Ushbu filtrlar bo'yicha baholash tarixi mavjud emas.</p>
           </div>
         )}
      </div>
    </div>
  );
}
