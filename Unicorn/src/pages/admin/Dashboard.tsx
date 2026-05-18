import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import { 
  Users, AlertTriangle, FileText, MessageSquare, CheckCircle, ChevronRight, 
  TrendingUp, TrendingDown, Clock, ShieldAlert, X, FileCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { students, certificates, messages, pointChanges } = useAppContext();
  const navigate = useNavigate();
  const [showAllChanges, setShowAllChanges] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Bugun, ${hours}:${minutes}`;
  };
  
  const totalStudents = students.length;
  const atRiskStudents = students.filter(s => s.riskStatus === 'At Risk' || s.riskStatus === 'Danger');
  const pendingCerts = certificates.filter(c => c.status === 'Pending');
  const unreadMessages = messages.length; // Simplified for mock

  const recentScoreChanges = pointChanges.slice(0, 5).map(pc => {
    const student = students.find(s => s.id === pc.studentId);
    return {
      ...pc,
      studentName: student?.name || 'Unknown',
    };
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Admin Boshqaruvi</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Talabalar faoliyati va tezkor vazifalar</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold bg-white border border-[#E8EFED] px-4 py-2 rounded-xl shadow-sm text-[#9DB4AB]">
          <Clock className="w-4 h-4 text-[#0A9B82]" />
          <span>Oxirgi yangilanish: {formatTime(currentTime)}</span>
        </div>
      </div>

      {/* SECTION 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Jami Talabalar" 
          value={totalStudents} 
          icon={Users} 
          color="primary" 
          description="Sistemadagi faol talabalar"
        />
        <StatCard 
          title="Xavf ostidagilar" 
          value={atRiskStudents.length} 
          icon={AlertTriangle} 
          color="danger" 
          description="E'tibor talab qiladiganlar" 
        />
        <StatCard 
          title="Kutilayotgan Sertifikatlar" 
          value={pendingCerts.length} 
          icon={FileText} 
          color="warning" 
          description="Ko'rib chiqish kutilmoqda"
          onClick={() => navigate('/admin/certificates')}
        />
        <StatCard 
          title="Yangi Xabarlar" 
          value={unreadMessages} 
          icon={MessageSquare} 
          color="secondary" 
          description="Talabalar so'rovlari"
          onClick={() => navigate('/admin/messages')}
        />
      </div>

      {/* SECTION 2: Action Items */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Task Cards */}
        {[
          { 
            id: 'cert',
            count: pendingCerts.length, 
            label: 'ta sertifikat tasdiqlash kutilmoqda',
            desc: "Sertifikatlarni ko'ring va ballarni bering",
            icon: FileCheck,
            iconBg: 'bg-[rgba(10,155,130,0.1)]',
            iconColor: 'text-[#0A9B82]',
            path: '/admin/certificates'
          },
          { 
            id: 'risk',
            count: atRiskStudents.length, 
            label: 'ta talaba xavf ostida',
            desc: "Ushbu talabalar grantdan ayrilishi mumkin",
            icon: AlertTriangle,
            iconBg: 'bg-[rgba(255,184,0,0.1)]',
            iconColor: 'text-[#FFB800]',
            path: '/admin/students?filter=risk'
          },
          { 
            id: 'msg',
            count: unreadMessages, 
            label: 'ta yangi xabar',
            desc: "Yangi kelib tushgan savollarga javob bering",
            icon: MessageSquare,
            iconBg: 'bg-[rgba(37,99,235,0.1)]',
            iconColor: 'text-[#2563EB]',
            path: '/admin/messages'
          },
        ].map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-[#E8EFED] rounded-[12px] p-4 flex items-center gap-4 hover:border-[#0A9B82]/30 hover:shadow-[0_2px_12px_rgba(10,155,130,0.06)] transition-all group"
          >
            <div className={cn("w-11 h-11 rounded-full flex items-center justify-center shrink-0", item.iconBg, item.iconColor)}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0D1F1A] tracking-tight truncate">{item.count} {item.label}</p>
              <p className="text-[13px] text-[#6B8A80] truncate">{item.desc}</p>
            </div>
            <button 
              onClick={() => navigate(item.path)}
              className="h-9 px-[18px] bg-[#0A9B82] text-white rounded-[8px] text-[13px] font-semibold flex items-center gap-1.5 hover:bg-[#087D6A] transition-all shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 3: Recent Score Changes */}
        <div className="bg-white rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#E8EFED] flex items-center justify-between bg-[#F8FFFE]">
            <h3 className="text-sm font-bold text-[#0D1F1A] uppercase tracking-tight">So'nggi o'zgarishlar</h3>
            <button 
              onClick={() => setShowAllChanges(true)}
              className="text-xs font-bold text-[#0A9B82] hover:underline cursor-pointer"
            >
              Hammasini ko'rish →
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FFFE] text-[#9DB4AB] uppercase tracking-widest font-bold border-b border-[#E8EFED]">
                <tr>
                  <th className="px-6 py-3">Talaba</th>
                  <th className="px-6 py-3 text-center">Kategoriya</th>
                  <th className="px-6 py-3 text-center">O'zgarish</th>
                  <th className="px-6 py-3 text-right">Xodim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F3]">
                {recentScoreChanges.map(pc => (
                  <tr key={pc.id} className="hover:bg-[#F8FFFE] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0D1F1A]">{pc.studentName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md font-bold text-[10px] uppercase",
                        pc.category === 'Amaliyot' ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#EDF7F4] text-[#0A9B82]"
                      )}>{pc.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-sm">
                      <div className="flex items-center justify-center gap-1">
                        {pc.amount > 0 ? <TrendingUp className="w-3.5 h-3.5 text-[#0A9B82]" /> : <TrendingDown className="w-3.5 h-3.5 text-[#DC2626]" />}
                        <span className={pc.amount > 0 ? "text-[#0A9B82]" : "text-[#DC2626]"}>
                          {pc.amount > 0 ? `+${pc.amount}` : pc.amount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-[#6B8A80] font-medium italic">{pc.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: At-Risk Students */}
        <div className="bg-white rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#E8EFED] flex items-center justify-between bg-[#F8FFFE]">
            <h3 className="text-sm font-bold text-[#0D1F1A] uppercase tracking-tight">Xavf ostidagilar</h3>
            <button 
              onClick={() => navigate('/admin/students?filter=risk')}
              className="text-xs font-bold text-[#0A9B82] hover:underline cursor-pointer"
            >
              Barcha ro'yxat →
            </button>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {atRiskStudents.slice(0, 3).map(student => (
              <div 
                key={student.id} 
                onClick={() => navigate(`/admin/students/profile/${student.id}`)}
                className="flex items-center justify-between p-4 bg-[#F8FFFE] rounded-[12px] border border-[#E8EFED] group hover:border-[#0A9B82]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF7F4] flex items-center justify-center font-bold text-[#0A9B82] border border-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-[#0D1F1A] text-sm group-hover:text-[#0A9B82] transition-colors">{student.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#9DB4AB] font-medium uppercase">{student.year}-kurs • {student.group}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-[#DC2626] leading-none mb-1 flex items-center justify-end gap-1">
                      {student.totalScore}
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </p>
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                      student.riskStatus === 'Danger' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {student.riskStatus}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9DB4AB] group-hover:text-[#0A9B82] transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel: All Score Changes */}
      <AnimatePresence>
        {showAllChanges && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllChanges(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#E8EFED] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0D1F1A]">Barcha o'zgarishlar</h2>
                <button 
                  onClick={() => setShowAllChanges(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-[#9DB4AB] hover:text-[#0D1F1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FFFE] text-[#9DB4AB] uppercase tracking-widest font-bold border-b border-[#E8EFED] sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Sana/Talaba</th>
                      <th className="px-6 py-4 text-center">O'zgarish</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F3]">
                    {pointChanges.map(pc => {
                      const student = students.find(s => s.id === pc.studentId);
                      return (
                        <tr key={pc.id} className="hover:bg-[#F8FFFE] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#0D1F1A] mb-0.5">{student?.name || 'Talaba'}</p>
                            <p className="text-[10px] text-[#9DB4AB] font-medium">{new Date(pc.date).toLocaleDateString()} · {pc.category}</p>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-sm">
                            <div className="flex items-center justify-center gap-1">
                              {pc.amount > 0 ? <TrendingUp className="w-3.5 h-3.5 text-[#0A9B82]" /> : <TrendingDown className="w-3.5 h-3.5 text-[#DC2626]" />}
                              <span className={pc.amount > 0 ? "text-[#0A9B82]" : "text-[#DC2626]"}>
                                {pc.amount > 0 ? `+${pc.amount}` : pc.amount}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
