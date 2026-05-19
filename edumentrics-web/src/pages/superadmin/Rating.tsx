import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trophy, Search, Filter, Download, Medal, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function SuperAdminRating() {
  const { students } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('Barcha');
  const [grantFilter, setGrantFilter] = useState('Barcha');

  const filteredStudents = students
    .filter(s => 
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (yearFilter === 'Barcha' || s.year.toString() === yearFilter) &&
      (grantFilter === 'Barcha' || s.grantType === grantFilter || (grantFilter === 'Grant emas' && s.grantType === 'None'))
    )
    .sort((a, b) => b.scores.finalScore - a.scores.finalScore);

  const stats = {
    total: students.length,
    atRisk: students.filter(s => s.scores.akademik.gpa < 80 || (s.grantType === 'Unicorn' && s.scores.finalScore < 80)).length,
    highPerformers: students.filter(s => s.scores.finalScore >= 90).length,
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Universitet Reytingi</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Barcha talabalarning akademik va amaliy natijalari reytingi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#E8EFED] rounded-xl text-[#0D1F1A] hover:bg-slate-50 transition-colors bg-white font-bold text-[13px] shadow-sm">
          <Download className="w-4 h-4 text-[#0A9B82]" />
          <span>PDF yuklab olish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-[#E8EFED] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F4F7F6] text-[#0A9B82] rounded-xl flex items-center justify-center"><Trophy className="w-6 h-6" /></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#9DB4AB]">Jami talabalar</p><p className="text-2xl font-black text-[#0D1F1A] mt-0.5">{stats.total}</p></div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-[#E8EFED] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FEF2F2] text-[#DC2626] rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6" /></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#9DB4AB]">Grant xavf ostida</p><p className="text-2xl font-black text-[#0D1F1A] mt-0.5">{stats.atRisk}</p></div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-[#E8EFED] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFFBEB] text-[#D97706] rounded-xl flex items-center justify-center"><Medal className="w-6 h-6" /></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#9DB4AB]">A'lochilar (&gt;90 ball)</p><p className="text-2xl font-black text-[#0D1F1A] mt-0.5">{stats.highPerformers}</p></div>
         </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8EFED] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8EFED] bg-[#F8FFFE] flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
                <input 
                    type="text"
                    placeholder="Ism yoki guruh bo'yicha qidiruv"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-[#E8EFED] rounded-xl text-[13px] font-medium outline-none focus:border-[#0A9B82] focus:ring-2 focus:ring-[#0A9B82]/10 transition-all font-sans"
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <select className="px-4 py-2 border border-[#E8EFED] rounded-xl text-[13px] font-bold text-[#0D1F1A] outline-none bg-white" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  <option value="Barcha">Barcha kurslar</option>
                  <option value="1">1-kurs</option>
                  <option value="2">2-kurs</option>
                  <option value="3">3-kurs</option>
                  <option value="4">4-kurs</option>
               </select>
               <select className="px-4 py-2 border border-[#E8EFED] rounded-xl text-[13px] font-bold text-[#0D1F1A] outline-none bg-white" value={grantFilter} onChange={e => setGrantFilter(e.target.value)}>
                  <option value="Barcha">Barcha grantlar</option>
                  <option value="Unicorn">Unicorn</option>
                  <option value="Golden Mind">Golden Mind</option>
                  <option value="Grant emas">Grant emas</option>
               </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FFFE] border-b border-[#E8EFED]">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB] w-16">#</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Talaba</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Guruh</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Ball (Total)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Grant</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB] text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFED]/50 relative">
              {filteredStudents.map((student, index) => {
                const isUnicornAtRisk = student.grantType === 'Unicorn' && student.scores.finalScore < 80;
                const isGoldenAtRisk = student.grantType === 'Golden Mind' && student.scores.finalScore < 85;
                const isAtRisk = isUnicornAtRisk || isGoldenAtRisk || student.scores.akademik.gpaWarning;
                
                return (
                  <tr key={student.id} className={cn("hover:bg-[#F8FFFE] transition-colors relative z-10 group", isAtRisk ? "bg-red-50/30" : "")}>
                    <td className="px-6 py-4">
                      {index === 0 && <Medal className="w-6 h-6 text-[#FFD700]" />}
                      {index === 1 && <Medal className="w-6 h-6 text-[#C0C0C0]" />}
                      {index === 2 && <Medal className="w-6 h-6 text-[#CD7F32]" />}
                      {index > 2 && <span className="font-bold text-[#6B8A80] text-sm">#{index + 1}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82] font-black text-xs border border-[#0A9B82]/20 shadow-sm shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D1F1A]">{student.name}</p>
                          {student.scores.akademik.gpaWarning && (
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-0.5">⚠️ GPA {student.scores.akademik.gpa}% (XAVF)</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-[#6B8A80]">{student.group}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-[#0D1F1A]">{student.scores.finalScore}</span>
                      </div>
                      <p className="text-[9px] font-bold text-[#9DB4AB] uppercase mt-0.5">{student.scores.asosiyTotal} asosiy {student.scores.bonus.bandlikBonusi.value+student.scores.bonus.reabilitatsiya.value>0?`+${student.scores.bonus.bandlikBonusi.value+student.scores.bonus.reabilitatsiya.value} bonus`:''} {student.scores.bonus.jarimalar.value<0?`${student.scores.bonus.jarimalar.value} jarima`:''}</p>
                    </td>
                    <td className="px-6 py-4">
                      {student.grantType === 'Unicorn' ? (
                        <span className={cn("px-2 py-1 rounded border text-[10px] font-black uppercase tracking-widest", isAtRisk ? "bg-red-50 text-red-600 border-red-200" : "bg-purple-50 text-purple-600 border-purple-200")}>🦄 Unicorn</span>
                      ) : student.grantType === 'Golden Mind' ? (
                        <span className={cn("px-2 py-1 rounded border text-[10px] font-black uppercase tracking-widest", isAtRisk ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200")}>🧠 Golden Mind</span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[10px] font-black uppercase tracking-widest">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                       {index % 3 === 0 ? <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto" /> 
                      : index % 3 === 1 ? <TrendingDown className="w-5 h-5 text-rose-500 mx-auto" /> 
                      : <Minus className="w-5 h-5 text-[#9DB4AB] mx-auto" />}
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#9DB4AB] font-bold text-sm">Bunday natija topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
