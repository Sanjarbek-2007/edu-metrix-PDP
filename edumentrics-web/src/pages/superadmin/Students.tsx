import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, CheckCircle, AlertTriangle, ChevronRight, Sparkles, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function Students() {
  const { students } = useAppContext();
  const navigate = useNavigate();

  const years = [1, 2, 3, 4] as const;

  const getYearStats = (year: number) => {
    const yearStudents = students.filter(s => s.year === year);
    const total = yearStudents.length;
    
    if (total === 0) return { total: 0, groups: 0, avg: 0, grantActive: 0, atRisk: 0 };

    const groupsCount = new Set(yearStudents.map(s => s.group).filter(Boolean)).size || 4;
    const avg = Math.round(yearStudents.reduce((acc, s) => acc + s.totalScore, 0) / total);
    const grantActive = yearStudents.filter(s => s.grantType !== 'None').length;
    const atRisk = yearStudents.filter(s => s.riskStatus === 'At Risk' || s.riskStatus === 'Danger').length;

    return { total, groups: groupsCount, avg, grantActive, atRisk };
  };

  return (
    <div className="space-y-8">
      {/* Page Header consistent with Fix 6 */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Talabalar › Yillar kesimida</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Yillar kesimida talabalar</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">Guruhlar va talabalarni ko'rish uchun o'quv yilini tanlang</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {years.map(year => {
          const stats = getYearStats(year);
          const isUnicorn = year === 1 || year === 2;
          const grantName = isUnicorn ? 'Unicorn Grant' : 'Golden Mind Grant';
          const grantShort = isUnicorn ? '🦄' : '🧠';
          const yearOrdinals = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'];
          const yearLabel = yearOrdinals[year - 1];
          
          const badgeStyles = [
            'bg-[#EDF7F4] text-[#0A9B82]',
            'bg-[#EDF3FA] text-[#2563EB]',
            'bg-[#FDF4EC] text-[#D97706]',
            'bg-[#F5EDF9] text-[#7C3AED]'
          ][year - 1];

          return (
            <motion.div
              key={year}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/superadmin/students/year/${year}`)}
              className="bg-white rounded-[14px] border border-[#E8EFED] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer transition-all hover:border-[#0A9B82] hover:shadow-[0_4px_24px_rgba(10,155,130,0.12)] group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase", badgeStyles)}>
                    Year {year}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#0D1F1A] tracking-tight leading-none mb-1">{yearLabel}</h3>
                    <p className="text-[13px] text-[#9DB4AB] font-medium">{grantName}</p>
                  </div>
                </div>
                <div className="p-2 border border-[#E8EFED] rounded-lg text-[#9DB4AB] group-hover:text-[#0A9B82] group-hover:border-[#0A9B82] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div className="border-y border-[#F0F4F3] py-4 grid grid-cols-3 gap-2">
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <Users className="w-4 h-4 text-[#0A9B82]" />
                    <span className="text-[22px] font-bold text-[#0D1F1A]">{stats.total}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#9DB4AB] uppercase tracking-wide">Students</span>
                </div>
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[22px] font-bold text-[#0D1F1A]">{stats.groups}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#9DB4AB] uppercase tracking-wide">Groups</span>
                </div>
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <AlertTriangle className={cn("w-4 h-4", stats.atRisk > 0 ? "text-[#FF4C6A]" : "text-[#00C896]")} />
                    <span className={cn("text-[22px] font-bold", stats.atRisk > 0 ? "text-[#FF4C6A]" : "text-[#00C896]")}>{stats.atRisk}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#9DB4AB] uppercase tracking-wide">At Risk</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[13px] font-semibold text-[#374151]">Average Score</span>
                  <div className="bg-[#EDF7F4] text-[#0A9B82] px-2.5 py-0.5 rounded-full text-[12px] font-bold border border-[#C6E5DF]">
                    {grantShort} {stats.grantActive} Active
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#EDF7F4] rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0A9B82] to-[#06D6A0] rounded-full transition-all duration-500" 
                    style={{ width: `${stats.avg}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-bold text-[#0D1F1A] leading-none mb-1">{stats.avg} / 100</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
