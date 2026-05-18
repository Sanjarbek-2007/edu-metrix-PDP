import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronRight, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function Groups() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { students } = useAppContext();
  
  const yearNum = parseInt(year || '1');
  const yearStudents = students.filter(s => s.year === yearNum);
  
  const groupsRecord: Record<string, typeof students> = {};
  yearStudents.forEach(s => {
    const g = s.group || `Unassigned`;
    if (!groupsRecord[g]) groupsRecord[g] = [];
    groupsRecord[g].push(s);
  });
  
  const groups = Object.keys(groupsRecord).map(gName => {
    const sList = groupsRecord[gName];
    const total = sList.length;
    const avg = Math.round(sList.reduce((acc, s) => acc + s.totalScore, 0) / (total || 1));
    const risk = sList.filter(s => s.riskStatus === 'At Risk' || s.riskStatus === 'Danger').length;
    
    return { name: gName, total, avg, risk };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const yearOrdinals = ['1-kurs', '2-kurs', '3-kurs', '4-kurs'];
  const yearLabel = yearOrdinals[yearNum - 1];

  return (
    <div className="space-y-8">
      {/* Page Header consistent with Fix 6 */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">
            <Link to="/superadmin/students" className="hover:text-[#0A9B82] transition-colors">Talabalar</Link> › {yearLabel}
          </p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">{yearLabel} guruhlar</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">{yearLabel} talabalar guruhlari ro'yxati</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group, idx) => {
          const sList = groupsRecord[group.name];
          const safeCount = sList.filter(s => s.riskStatus === 'Safe').length;
          const riskCount = sList.filter(s => s.riskStatus === 'At Risk').length;
          const dangerCount = sList.filter(s => s.riskStatus === 'Danger').length;

          const progressColor = 
            group.avg >= 85 ? 'bg-[#0A9B82]' : 
            group.avg >= 75 ? 'bg-[#FFB800]' : 'bg-[#FF4C6A]';

          return (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/superadmin/students/year/${year}/group/${group.name}`)}
              className="bg-white border border-[#E8EFED] rounded-[12px] p-[18px] pb-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer transition-all hover:border-[#0A9B82] hover:shadow-[0_4px_16px_rgba(10,155,130,0.10)] group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[16px] font-bold text-[#0D1F1A] leading-tight capitalize">{group.name} - guruh</h3>
                <div className="p-1 border border-[#E8EFED] rounded-lg text-[#9DB4AB] group-hover:text-[#0A9B82] group-hover:border-[#0A9B82] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F4F3] space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <div className="flex items-center gap-2 text-[#6B8A80]">
                    <Users className="w-4 h-4" />
                    <span>{group.total} students</span>
                  </div>
                  <div className="font-semibold text-[#0D1F1A]">Avg: {group.avg}/100</div>
                </div>

                <div className="w-full h-1.5 bg-[#EDF7F4] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", progressColor)} 
                    style={{ width: `${group.avg}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {safeCount > 0 && (
                    <div className="bg-[rgba(0,200,150,0.08)] text-[#00C896] px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
                      Safe: {safeCount}
                    </div>
                  )}
                  {riskCount > 0 && (
                    <div className="bg-[rgba(255,184,0,0.08)] text-[#FFB800] px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                      At Risk: {riskCount}
                    </div>
                  )}
                  {dangerCount > 0 && (
                    <div className="bg-[rgba(255,76,106,0.08)] text-[#FF4C6A] px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF4C6A]" />
                      Danger: {dangerCount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {groups.length === 0 && (
          <div className="col-span-full py-12 edumetric-card text-center text-text-muted">
            Bu kurs uchun guruhlar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}
