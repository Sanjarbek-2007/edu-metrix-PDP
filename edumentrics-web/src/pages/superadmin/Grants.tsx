import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ChevronRight, Award, AlertTriangle, CheckCircle, Download, Eye, Ban, Check, ShieldAlert, Plus, Sparkles, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Grants() {
  const { students } = useAppContext();
  const navigate = useNavigate();
  
  const [activeGrant, setActiveGrant] = useState<'Unicorn' | 'Golden Mind'>('Unicorn');
  const [activeYear, setActiveYear] = useState<number | 'All'>(1);
  const [activeStatus, setActiveStatus] = useState<string>('All');

  const [modalType, setModalType] = useState<'Approve' | 'Suspend' | 'Revoke' | null>(null);
  const [targetStudent, setTargetStudent] = useState<any>(null);

  const targetScore = activeGrant === 'Unicorn' ? 80 : 85;
  const availableYears = activeGrant === 'Unicorn' ? [1, 2] : [3, 4];

  const handleGrantSwitch = (grant: 'Unicorn' | 'Golden Mind') => {
    setActiveGrant(grant);
    setActiveYear(grant === 'Unicorn' ? 1 : 3);
    setActiveStatus('All');
  };

  const getSimulatedStatus = (s: any) => {
    if (s.grantType === activeGrant) return 'Active';
    if (s.grantType === `Suspended_${activeGrant.split(' ')[0]}`) return 'Suspended';
    if (s.totalScore >= targetScore && s.grantType === 'None') return 'Candidate';
    if (s.totalScore >= targetScore - 5 && s.totalScore < targetScore && (s.grantType === activeGrant || s.grantType === 'None')) return 'At Risk';
    return 'None';
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (!availableYears.includes(s.year) && !s.grantType.includes(activeGrant.split(' ')[0])) return false;
      if (activeYear !== 'All' && s.year !== activeYear) return false;
      const status = getSimulatedStatus(s);
      if (status === 'None' && s.totalScore < targetScore - 5) return false;
      if (activeStatus !== 'All' && status !== activeStatus) return false;
      return true;
    }).sort((a,b) => b.totalScore - a.totalScore);
  }, [students, activeGrant, activeYear, activeStatus]);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header consistent with Fix 6 */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Grantlar › Grant boshqaruvi</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Grant boshqaruvi</h1>
          <p className="text-[14px] text-[#6B8A80] mt-1">Talabalar uchun grantlarni ko'rib chiqish va tasdiqlash</p>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#374151] px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#E8EFED] shadow-sm transition-all">
          <Download className="w-4 h-4" /> Eksport (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ y: -3 }}
          onClick={() => handleGrantSwitch('Unicorn')}
          className={cn(
            "p-7 rounded-[16px] text-left transition-all relative overflow-hidden flex flex-col group h-48",
            activeGrant === 'Unicorn' 
              ? "bg-gradient-to-br from-[#0A9B82] to-[#06D6A0] text-white shadow-[0_4px_24px_rgba(10,155,130,0.25)]" 
              : "bg-[#FFFFFF] border border-[#E8EFED] text-[#0D1F1A] hover:border-[#0A9B82] hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-3">
               <Sparkles className={cn("w-7 h-7", activeGrant === 'Unicorn' ? "text-white" : "text-[#0A9B82]")} />
               <h3 className={cn("text-xl font-bold tracking-tight", activeGrant === 'Unicorn' ? "text-white" : "text-[#0D1F1A]")}>Unicorn Grant</h3>
            </div>
            <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", activeGrant === 'Unicorn' ? "text-white/60" : "text-[#9DB4AB]")} />
          </div>
          <p className={cn("text-[13px] mt-2 font-medium", activeGrant === 'Unicorn' ? "text-white/60" : "text-[#6B8A80]")}>
            1st & 2nd year students · 80+ ball
          </p>
          <div className={cn("mt-auto pt-4 border-t w-full grid grid-cols-3 gap-2", activeGrant === 'Unicorn' ? "border-white/20" : "border-[#F0F4F3]")}>
            <div className="text-center">
              <p className={cn("text-base font-bold", activeGrant === 'Unicorn' ? "text-white" : "text-[#0D1F1A]")}>12</p>
              <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Unicorn' ? "text-white/60" : "text-[#9DB4AB]")}>Active</p>
            </div>
            <div className={cn("text-center border-x", activeGrant === 'Unicorn' ? "border-white/10" : "border-[#F0F4F3]")}>
               <p className={cn("text-base font-bold", activeGrant === 'Unicorn' ? "text-white" : "text-[#0D1F1A]")}>4</p>
               <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Unicorn' ? "text-white/60" : "text-[#9DB4AB]")}>Candidate</p>
            </div>
            <div className="text-center">
               <p className={cn("text-base font-bold", activeGrant === 'Unicorn' ? "text-white" : "text-[#0D1F1A]")}>2</p>
               <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Unicorn' ? "text-white/60" : "text-[#9DB4AB]")}>At Risk</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          onClick={() => handleGrantSwitch('Golden Mind')}
          className={cn(
            "p-7 rounded-[16px] text-left transition-all relative overflow-hidden flex flex-col group h-48",
            activeGrant === 'Golden Mind' 
              ? "bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white shadow-[0_4px_24px_rgba(217,119,6,0.25)]" 
              : "bg-[#FFFFFF] border border-[#E8EFED] text-[#0D1F1A] hover:border-[#F59E0B] hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-3">
               <Brain className={cn("w-7 h-7", activeGrant === 'Golden Mind' ? "text-white" : "text-[#D97706]")} />
               <h3 className={cn("text-xl font-bold tracking-tight", activeGrant === 'Golden Mind' ? "text-white" : "text-[#0D1F1A]")}>Golden Mind</h3>
            </div>
            <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", activeGrant === 'Golden Mind' ? "text-white/60" : "text-[#9DB4AB]")} />
          </div>
          <p className={cn("text-[13px] mt-2 font-medium", activeGrant === 'Golden Mind' ? "text-white/60" : "text-[#6B8A80]")}>
            3rd & 4th year students · 85+ ball
          </p>
          <div className={cn("mt-auto pt-4 border-t w-full grid grid-cols-3 gap-2", activeGrant === 'Golden Mind' ? "border-white/20" : "border-[#F0F4F3]")}>
            <div className="text-center">
              <p className={cn("text-base font-bold", activeGrant === 'Golden Mind' ? "text-white" : "text-[#0D1F1A]")}>8</p>
              <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Golden Mind' ? "text-white/60" : "text-[#9DB4AB]")}>Active</p>
            </div>
            <div className={cn("text-center border-x", activeGrant === 'Golden Mind' ? "border-white/10" : "border-[#F0F4F3]")}>
               <p className={cn("text-base font-bold", activeGrant === 'Golden Mind' ? "text-white" : "text-[#0D1F1A]")}>6</p>
               <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Golden Mind' ? "text-white/60" : "text-[#9DB4AB]")}>Candidate</p>
            </div>
            <div className="text-center">
               <p className={cn("text-base font-bold", activeGrant === 'Golden Mind' ? "text-white" : "text-[#0D1F1A]")}>1</p>
               <p className={cn("text-[10px] uppercase tracking-wider font-bold", activeGrant === 'Golden Mind' ? "text-white/60" : "text-[#9DB4AB]")}>At Risk</p>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="table-container">
        <div className="px-6 py-2 border-b border-[#E8EFED] bg-white flex flex-wrap gap-8 items-center justify-between">
          <div className="flex gap-6">
             {['All', ...availableYears].map(y => (
               <button 
                key={y} 
                onClick={() => setActiveYear(y as any)} 
                className={cn(
                  "py-4 text-[14px] font-semibold transition-all relative border-b-2",
                  activeYear === y ? "text-[#0A9B82] border-[#0A9B82]" : "text-[#6B8A80] border-transparent hover:text-[#0D1F1A]"
                )}
               >
                 {y === 'All' ? 'Barchasi' : `${y}-kurs`}
               </button>
             ))}
          </div>

          <div className="flex gap-4">
            {['All', 'Active', 'Candidate', 'At Risk', 'Suspended'].map(s => (
              <button 
                key={s} 
                onClick={() => setActiveStatus(s)} 
                className={cn(
                  "py-4 text-[13px] font-semibold transition-all relative border-b-2",
                  activeStatus === s ? "text-[#0A9B82] border-[#0A9B82]" : "text-[#6B8A80] border-transparent hover:text-[#0D1F1A]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-bold tracking-[0.06em]">
                <th className="px-6 py-4">F.I.SH.</th>
                <th className="px-6 py-4 text-center">Guruh</th>
                <th className="px-6 py-4 text-center">Ball</th>
                <th className="px-6 py-4 text-center">Holat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {filteredStudents.map(s => {
                const status = getSimulatedStatus(s);
                return (
                  <tr key={s.id} className="hover:bg-[#F8FFFE] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} alt="avatar" className="w-9 h-9 rounded-full border border-[#E8EFED]" />
                        <Link to={`/superadmin/students/profile/${s.id}`} className="font-bold text-[#0D1F1A] hover:text-[#0A9B82] transition-colors">{s.name}</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-[#6B8A80] font-medium">{s.group}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "font-extrabold text-base", 
                        s.totalScore >= targetScore ? "text-[#0A9B82]" : 
                        s.totalScore >= targetScore - 5 ? "text-[#D97706]" : "text-[#FF4C6A]"
                      )}>
                        {s.totalScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                         "inline-flex px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap",
                         status === 'Active' ? "bg-[#EDF7F4] text-[#0A9B82] border-[rgba(10,155,130,0.2)]" :
                         status === 'Candidate' ? "bg-[#EFF6FF] text-[#2563EB] border-[rgba(37,99,235,0.2)]" :
                         status === 'At Risk' ? "bg-[#FFF8ED] text-[#D97706] border-[rgba(217,119,6,0.2)]" :
                         status === 'Suspended' ? "bg-[#FEF2F2] text-[#DC2626] border-[rgba(220,38,38,0.2)]" : 
                         "bg-slate-100 text-[#9DB4AB] border-slate-200"
                      )}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {status === 'Candidate' && (
                          <button 
                            onClick={() => { setTargetStudent(s); setModalType('Approve'); }} 
                            className="h-[32px] px-3 bg-[#0A9B82] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#087D6A] transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/superadmin/students/profile/${s.id}`)}
                          className="h-[32px] px-4 bg-white border border-[#D1D5DB] rounded-lg text-xs font-bold text-[#374151] hover:border-[#0A9B82] hover:text-[#0A9B82] hover:bg-[#F8FFFE] transition-all cursor-pointer"
                        >
                          Profil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm edumetric-card relative z-10 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">Tasdiqlash</h3>
              <p className="text-sm text-text-secondary mb-6">
                Haqiqatan ham <strong className="text-text-primary">{targetStudent?.name}</strong> uchun grant holatini o'zgartirmoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModalType(null)} className="flex-1 py-2 text-text-muted hover:text-text-primary text-sm font-bold transition-all">Bekor qilish</button>
                <button 
                  onClick={() => { toast.success('Muvaffaqiyatli o\'zgartirildi'); setModalType(null); }}
                  className={cn(
                    "flex-1 py-2 text-white rounded-lg text-sm font-bold transition-all",
                    modalType === 'Approve' ? "bg-success shadow-lg shadow-success/10" : "bg-danger shadow-lg shadow-danger/10"
                  )}
                >
                  Tasdiqlash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
