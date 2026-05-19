import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Users, Award, AlertTriangle, Activity, ChevronRight, Eye, Sparkles, TrendingUp, ArrowRight, X, Clock, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const CountUp = ({ end, duration = 1000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <>{count}</>;
};

function KPICard({ title, value, icon: Icon, color, trend, onClick }: any) {
  const iconBg = {
    primary: 'bg-[#EDF7F4] text-[#0A9B82]',
    secondary: 'bg-[#EFF6FF] text-[#2563EB]',
    danger: 'bg-[#FFFBEB] text-[#FFB800]',
    success: 'bg-[#F5F3FF] text-[#7C3AED]',
  }[color as string] || 'bg-slate-100 text-slate-600';

  const isPositive = trend.startsWith('+');

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white border border-[#E8EFED] rounded-[14px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all cursor-pointer group",
        onClick && "hover:border-[#0A9B82] hover:shadow-lg active:scale-95"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-[0.08em]">{title}</span>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-extrabold text-[#0D1F1A] tracking-[-1px] mb-2 leading-none">
          <CountUp end={value} />
        </span>
        <div className={cn(
          "flex items-center gap-1 text-[12px] font-semibold",
          isPositive ? "text-[#0A9B82]" : "text-[#FF4C6A]"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
          {trend} shu oyda
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { students, setIsActivitySidebarOpen } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('6M');

  const totalStudents = students.length;
  const activeGrants = students.filter(s => s.grantType !== 'None').length;
  const atRisk = students.filter(s => s.riskStatus === 'At Risk' || s.riskStatus === 'Danger').length;
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / (totalStudents || 1));

  const atRiskStudentsList = students
    .filter(s => s.riskStatus === 'At Risk' || s.riskStatus === 'Danger')
    .slice(0, 4);

  const trendDataMap: any = {
    '1M': [{ name: '1-hafta', score: 81.2 }, { name: '2-hafta', score: 81.5 }, { name: '3-hafta', score: 82.0 }, { name: '4-hafta', score: 82.3 }],
    '3M': [{ name: 'Mart', score: 79.5 }, { name: 'Apr', score: 81.0 }, { name: 'May', score: 82.3 }],
    '6M': [
      { name: 'Dek', score: 76.5 }, { name: 'Yan', score: 77.2 }, { name: 'Feb', score: 78.5 },
      { name: 'Mar', score: 79.5 }, { name: 'Apr', score: 81.0 }, { name: 'May', score: 82.3 },
    ]
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E8EFED] p-3 rounded-xl shadow-xl">
          <p className="text-[#9DB4AB] text-[9px] uppercase font-bold tracking-widest mb-1">{label}</p>
          <p className="text-[#0D1F1A] font-bold text-sm tracking-tight">{payload[0].value} ball</p>
        </div>
      );
    }
    return null;
  };

  const activityPreview = [
    { text: "Komendant 24 talaba borligini tasdiqladi", time: "5 daqiqa oldin", icon: Activity, color: "text-[#0A9B82] bg-[#EDF7F4]" },
    { text: "Sardor E. sertifikati tasdiqlandi (+4 ball)", time: "12 daqiqa oldin", icon: Award, color: "text-[#2563EB] bg-[#EFF6FF]" },
    { text: "Malika Y. yangi sertifikat yukladi", time: "18 daqiqa oldin", icon: Sparkles, color: "text-[#D97706] bg-[#FFFBEB]" },
    { text: "LMS sinxronizatsiyasi yakunlandi", time: "1 soat oldin", icon: CheckCircle2, color: "text-[#0A9B82] bg-[#EDF7F4]" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Boshqaruv paneli › Dashboard</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Dashboard</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1">Universitet ekotizimi va asosiy ko'rsatkichlar</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/superadmin/reports')} className="px-5 py-2 bg-white border border-[#E8EFED] text-[#374151] rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Hisobotlar
          </button>
          <button onClick={() => navigate('/superadmin/students')} className="px-5 py-2 bg-[#0A9B82] text-white rounded-lg text-sm font-semibold hover:bg-[#087A66] transition-colors shadow-sm">
            Talabalar boshqaruvi
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Jami talabalar" value={totalStudents} icon={Users} color="primary" trend="+12" onClick={() => navigate('/superadmin/students')} />
        <KPICard title="Faol grantlar" value={activeGrants} icon={Award} color="secondary" trend="+3" onClick={() => navigate('/superadmin/grants')} />
        <KPICard title="Xavf ostida" value={atRisk} icon={AlertTriangle} color="danger" trend="-5" onClick={() => navigate('/superadmin/students')} />
        <KPICard title="O'rtacha ball" value={avgScore} icon={Activity} color="success" trend="+1.2%" onClick={() => navigate('/superadmin/reports')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[13px] font-semibold text-[#374151] uppercase tracking-[0.06em]">Universitet dinamikasi</h3>
              <p className="text-[11px] text-[#9DB4AB] font-medium uppercase mt-0.5 italic tracking-widest">O'rtacha ball o'zgarishi</p>
            </div>
            <div className="flex bg-[#F4F7F6] rounded-xl p-1 border border-[#E8EFED]">
              {['1M', '3M', '6M'].map(tab => (
                <button
                  key={tab}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
                    activeTab === tab ? "bg-white text-[#0A9B82] shadow-sm ring-1 ring-slate-200/50" : "text-[#9DB4AB] hover:text-[#6B8A80]"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendDataMap[activeTab]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A9B82" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A9B82" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F3" vertical={false} />
                <XAxis dataKey="name" stroke="#9DB4AB" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#9DB4AB" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} dx={-15} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#0A9B82" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] flex flex-col h-full">
           <h3 className="text-[13px] font-semibold text-[#374151] uppercase tracking-[0.06em] mb-6 flex items-center justify-between">
              Tizim voqealari
              <div className="h-2 w-2 rounded-full bg-[#0A9B82] animate-pulse" />
           </h3>
           <div className="space-y-6 flex-1 overflow-y-auto">
            {activityPreview.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className={cn("p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 shadow-sm", item.color)}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1F3A34] leading-snug group-hover:text-[#0A9B82] transition-colors">{item.text}</p>
                  <span className="text-[10px] font-medium text-[#9DB4AB] uppercase mt-1 tracking-widest block italic">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsActivitySidebarOpen(true)}
            className="mt-8 w-full py-3 bg-[#F4F7F6] hover:bg-[#E8EFED] border border-[#E8EFED] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#6B8A80] transition-all active:scale-95"
          >
             Barchasini ko'rish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Risk Alerts Panel */}
        <div className="bg-white p-6 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[13px] font-semibold text-[#374151] uppercase tracking-[0.06em] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF4C6A]" />
              Xavf ostidagi talabalar
            </h3>
            <button onClick={() => navigate('/superadmin/students')} className="text-[11px] font-bold text-[#0A9B82] uppercase tracking-widest hover:underline cursor-pointer">Barchasi →</button>
          </div>
          
          <div className="space-y-3">
            {atRiskStudentsList.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-[#F0F4F3] bg-[#F4F7F6]/30 hover:bg-white hover:border-[#0A9B82] hover:shadow-md transition-all group/item">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} alt="avatar" className="w-10 h-10 rounded-xl border border-[#E8EFED] group-hover/item:rotate-3 transition-transform" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF4C6A] rounded-full border-2 border-white" />
                  </div>
                  <div className="cursor-pointer" onClick={() => navigate(`/superadmin/students/profile/${student.id}`)}>
                    <p className="font-bold text-[14px] text-[#0D1F1A] leading-tight group-hover/item:text-[#0A9B82] transition-colors">{student.name}</p>
                    <p className="text-[11px] font-medium text-[#9DB4AB] mt-0.5 uppercase tracking-wide">{student.year}-kurs • Xona {student.roomNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#FF4C6A] tracking-wider block mb-0.5">Ball</span>
                    <span className="text-lg font-extrabold text-[#0D1F1A] leading-none">{student.totalScore}</span>
                  </div>
                  <button onClick={() => navigate(`/superadmin/students/profile/${student.id}`)} className="p-2.5 rounded-lg bg-white border border-[#E8EFED] text-[#9DB4AB] hover:text-[#0A9B82] hover:border-[#0A9B82] transition-all shadow-sm active:scale-95 cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel for grants */}
        <div className="bg-white p-6 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] flex flex-col">
           <h3 className="text-[13px] font-semibold text-[#374151] uppercase tracking-[0.06em] mb-8">Grant holati</h3>
           <div className="flex-1 flex flex-col justify-center px-4">
             <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-end mb-2.5">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8A80]">Unicorn Grant</span>
                     <span className="text-lg font-bold text-[#0D1F1A] tracking-tight">45 nafar</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F7F6] rounded-full overflow-hidden border border-[#E8EFED]">
                    <div className="h-full bg-[#0A9B82] rounded-full w-[65%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between items-end mb-2.5">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8A80]">Golden Mind Grant</span>
                     <span className="text-lg font-bold text-[#0D1F1A] tracking-tight">30 nafar</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F7F6] rounded-full overflow-hidden border border-[#E8EFED]">
                    <div className="h-full bg-[#2563EB] rounded-full w-[45%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between items-end mb-2.5">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8A80]">Grantga nomzodlar</span>
                     <span className="text-lg font-bold text-[#0D1F1A] tracking-tight">120 nafar</span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F7F6] rounded-full overflow-hidden border border-[#E8EFED]">
                    <div className="h-full bg-slate-300 rounded-full w-[85%]" />
                  </div>
               </div>
             </div>
           </div>
           <button onClick={() => navigate('/superadmin/grants')} className="mt-8 group flex items-center justify-center gap-2 py-3 bg-[#EDF7F4] hover:bg-[#E1F1EE] border border-[#C6E5DF] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#0A9B82] transition-all active:scale-95 cursor-pointer">
              Hisobotni ko'rish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
}
