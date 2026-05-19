import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Download, BarChart2, ShieldAlert, Award, FileText, CheckCircle, Clock, Users, TrendingUp, Eye, CheckCircle2, AlertTriangle, Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Reports() {
  const { students, violations } = useAppContext();
  const [activeTab, setActiveTab] = useState<'performance' | 'violations' | 'grants'>('performance');

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Hisobot tayyorlanmoqda...',
        success: 'Hisobot muvaffaqiyatli yuklab olindi (PDF)',
        error: 'Xatolik yuz berdi',
      }
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="pb-5 border-b border-[#E8EFED] flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#9DB4AB] font-medium mb-1.5 tracking-wide italic">Boshqaruv paneli › Hisobotlar</p>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Tizim hisobotlari</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1">Universitet ma'lumotlari bo'yicha tahliliy hisobotlar</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-[#0A9B82] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-[#0A9B82]/20 hover:bg-[#087A66] transition-all">
          <Download className="w-4 h-4" /> Eksport (PDF)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#F4F7F6] border border-[#E8EFED] p-1 rounded-xl w-fit">
        {[
          { id: 'performance', label: 'Performance', icon: BarChart2 },
          { id: 'violations', label: 'Violations', icon: ShieldAlert },
          { id: 'grants', label: 'Grants', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all",
              activeTab === tab.id 
                ? "bg-white text-[#0A9B82] shadow-sm ring-1 ring-slate-200/50" 
                : "text-[#9DB4AB] hover:text-[#0D1F1A]"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'performance' && <PerformanceTab students={students} />}
          {activeTab === 'violations' && <ViolationsTab students={students} violations={violations} />}
          {activeTab === 'grants' && <GrantsTab students={students} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend, trendValue }: { label: string, value: string | number, icon: any, color: string, trend: 'up' | 'down' | 'none', trendValue: string }) {
  const colorMap: any = {
    teal: 'bg-[#EDF7F4] text-[#0A9B82]',
    blue: 'bg-[#EFF6FF] text-[#2563EB]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED]',
    orange: 'bg-[#FFFBEB] text-[#D97706]',
    red: 'bg-[#FEF2F2] text-[#DC2626]',
  };

  return (
    <div className="bg-white border border-[#E8EFED] rounded-[16px] p-5 flex flex-col shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[color] || 'bg-slate-100')}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[12px] uppercase font-bold tracking-[0.1em] text-[#9DB4AB]">{label}</span>
      </div>
      
      <p className="text-[32px] font-extrabold text-[#0D1F1A] tracking-[-1px] leading-none mb-2.5">{value}</p>
      
      <div className={cn(
        "flex items-center gap-1 text-[12px] font-semibold",
        trend === 'up' ? "text-[#0A9B82]" : trend === 'down' ? "text-[#DC2626]" : "text-[#9DB4AB]"
      )}>
        {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : trend === 'down' ? <TrendingUp className="w-3.5 h-3.5 rotate-180" /> : null}
        {trendValue}
      </div>
    </div>
  );
}

function PerformanceTab({ students }: { students: any[] }) {
  const navigate = useNavigate();
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / (students.length || 1));
  const topPerformers = [...students].sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
  
  const distributionData = useMemo(() => {
    const bins = [
      { range: '0-60', count: 0 }, { range: '61-70', count: 0 }, { range: '71-80', count: 0 }, { range: '81-90', count: 0 }, { range: '91-100', count: 0 },
    ];
    students.forEach(s => {
      if (s.totalScore <= 60) bins[0].count++;
      else if (s.totalScore <= 70) bins[1].count++;
      else if (s.totalScore <= 80) bins[2].count++;
      else if (s.totalScore <= 90) bins[3].count++;
      else bins[4].count++;
    });
    return bins;
  }, [students]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="O'rtacha ball" value={avgScore} icon={TrendingUp} color="teal" trend="up" trendValue="+1.2 pts o'sish" />
        <StatCard label="Yuqori natija" value="98%" icon={Sparkles} color="blue" trend="none" trendValue="Sardor Azizov" />
        <StatCard label="Talabalar soni" value={students.length} icon={Users} color="purple" trend="up" trendValue="+8 qo'shildi" />
      </div>

      <div className="bg-white border border-[#E8EFED] rounded-[20px] p-8 shadow-sm">
        <h3 className="text-[13px] font-bold text-[#374151] uppercase tracking-[0.06em] mb-8">Talabalar ballari taqsimoti</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} barCategoryGap="35%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A9B82" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0A9B82" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F3" vertical={false} />
              <XAxis dataKey="range" stroke="#9DB4AB" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={15} />
              <YAxis stroke="#9DB4AB" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dx={-15} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(10, 155, 130, 0.04)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-[#E8EFED] p-3 rounded-xl shadow-xl">
                        <p className="text-[#9DB4AB] text-[9px] uppercase font-bold tracking-widest mb-1">{label} oralig'i</p>
                        <p className="text-[#0A9B82] font-bold text-sm tracking-tight">{payload[0].value} ta o'quvchi</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E8EFED] rounded-[20px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#E8EFED] bg-[#F8FFFE]">
          <h3 className="text-[13px] font-bold text-[#0D1F1A] uppercase tracking-[0.06em]">Top 10 talaba (Akademik natija)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">F.I.SH.</th>
                <th className="px-6 py-4 text-center">Guruh</th>
                <th className="px-6 py-4 text-center">Kurs</th>
                <th className="px-6 py-4 text-center">Ball</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {topPerformers.map((s, idx) => (
                <tr key={s.id} className="hover:bg-[#F8FFFE] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-[#9DB4AB] w-5">{idx + 1}.</span>
                      <p className="font-bold text-[#0D1F1A]">{s.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[#6B8A80] font-medium">{s.group}</td>
                  <td className="px-6 py-4 text-center text-[#6B8A80] font-medium">{s.year}-kurs</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-base font-extrabold text-[#0A9B82]">{s.totalScore}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/superadmin/students/profile/${s.id}`)}
                      className="h-[32px] px-4 bg-white border border-[#D1D5DB] rounded-lg text-xs font-bold text-[#374151] hover:border-[#0A9B82] hover:text-[#0A9B82] hover:bg-[#F8FFFE] transition-all cursor-pointer"
                    >
                      Profilni ko'rish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ViolationsTab({ violations, students }: { violations: any[], students: any[] }) {
  const navigate = useNavigate();
  const totalViolations = violations.length;
  const critical = violations.filter(v => v.severity === 'Serious').length;
  const recentViolations = [...violations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const pieData = [
    { name: "Kichik", value: violations.filter(v => v.severity === "Minor").length, color: "#0A9B82" },
    { name: "O'rtacha", value: violations.filter(v => v.severity === "Moderate").length, color: "#D97706" },
    { name: "Serious", value: violations.filter(v => v.severity === "Serious").length, color: "#DC2626" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Jami qoidabuzarlik" value={totalViolations} icon={ShieldAlert} color="orange" trend="up" trendValue="+4 bu hafta" />
        <StatCard label="Serious (Qizil)" value={critical} icon={AlertTriangle} color="red" trend="down" trendValue="-2 kamaydi" />
        <StatCard label="Tinchlik ko'rsatkichi" value="92%" icon={CheckCircle2} color="teal" trend="up" trendValue="+1.5% o'sish" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E8EFED] rounded-[20px] p-6 shadow-sm">
           <h3 className="text-[13px] font-bold text-[#374151] uppercase tracking-[0.06em] mb-6">Darajalar bo'yicha ulush</h3>
           <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              </PieChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white border border-[#E8EFED] rounded-[20px] overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-[#E8EFED] bg-[#F8FFFE]">
            <h3 className="text-[13px] font-bold text-[#0D1F1A] uppercase tracking-[0.06em]">So'nggi qoidabuzarliklar</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-3">Talaba</th>
                  <th className="px-6 py-3 text-center">Daraja</th>
                  <th className="px-6 py-3 text-right">Ball</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F3]">
                {recentViolations.map((v) => {
                  const s = students.find(st => st.id === v.studentId);
                  return (
                    <tr key={v.id} className="hover:bg-[#F8FFFE] transition-colors">
                      <td className="px-6 py-3">
                        <p 
                          onClick={() => navigate(`/superadmin/students/profile/${s?.id}`)} 
                          className="font-bold text-[#0D1F1A] hover:text-[#0A9B82] transition-colors cursor-pointer"
                        >
                          {s?.name || 'Talaba'}
                        </p>
                        <p className="text-[11px] text-[#9DB4AB] font-medium">{v.type}</p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={cn(
                          "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                          v.severity === 'Minor' ? "text-[#0A9B82] border-[#EDF7F4] bg-[#EDF7F4]" :
                          v.severity === 'Moderate' ? "text-[#D97706] border-[#FFFBEB] bg-[#FFFBEB]" : 
                          "text-[#DC2626] border-[#FEF2F2] bg-[#FEF2F2]"
                        )}>
                          {v.severity}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-extrabold text-[#DC2626]">-{v.pointsDeducted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GrantsTab({ students }: { students: any[] }) {
  const navigate = useNavigate();
  const unicorn = students.filter(s => s.grantType === 'Unicorn').length;
  const golden = students.filter(s => s.grantType === 'Golden Mind').length;
  const suspended = students.filter(s => s.grantType.includes('Suspended')).length;

  const grantStats = [
    { name: 'Unicorn', count: unicorn, color: '#0A9B82' },
    { name: 'Golden Mind', count: golden, color: '#D97706' },
    { name: 'Nomzodlar', count: 120, color: '#2563EB' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Unicorn Grant" value={unicorn} icon={Award} color="teal" trend="up" trendValue="+3 bu oy" />
        <StatCard label="Golden Mind" value={golden} icon={Award} color="orange" trend="up" trendValue="+1 bu oy" />
        <StatCard label="Suspended" value={suspended} icon={AlertTriangle} color="red" trend="none" trendValue="O'zgarishsiz" />
      </div>

      <div className="bg-white border border-[#E8EFED] rounded-[20px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#E8EFED] bg-[#F8FFFE] flex justify-between items-center">
          <h3 className="text-[13px] font-bold text-[#0D1F1A] uppercase tracking-[0.06em]">Grant sohiblari (Faol)</h3>
          <button onClick={() => navigate('/superadmin/grants')} className="text-[11px] font-bold text-[#0A9B82] uppercase tracking-widest hover:underline cursor-pointer">Barchasini boshqarish →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8FFFE] text-[#9DB4AB] border-b border-[#E8EFED] text-[11px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Talaba</th>
                <th className="px-6 py-4 text-center">Tur</th>
                <th className="px-6 py-4 text-center">Ball</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F3]">
              {students.filter(s => s.grantType !== 'None' && !s.grantType.includes('Suspended')).slice(0, 10).map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FFFE] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#0D1F1A]">{s.name}</p>
                    <p className="text-[11px] text-[#9DB4AB] font-medium">{s.group}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider",
                      s.grantType === 'Unicorn' ? "text-[#0A9B82] border-[#EDF7F4] bg-[#EDF7F4]" : "text-[#D97706] border-[#FFFBEB] bg-[#FFFBEB]"
                    )}>
                      {s.grantType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-base font-extrabold text-[#0A9B82]">{s.totalScore}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/superadmin/students/profile/${s.id}`)}
                      className="h-[32px] px-4 bg-white border border-[#D1D5DB] rounded-lg text-xs font-bold text-[#374151] hover:border-[#0A9B82] hover:text-[#0A9B82] hover:bg-[#F8FFFE] transition-all cursor-pointer"
                    >
                      Profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
