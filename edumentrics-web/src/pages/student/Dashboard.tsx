import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Student } from '../../types';
import { Award, Clock, FileText, ChevronRight, Sparkles, Brain, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { calculateGrantEligibility } from '../../lib/scoring';

export default function Dashboard() {
  const { currentUser, pointChanges } = useAppContext();
  const student = currentUser as Student;
  const grantStatus = calculateGrantEligibility(student);

  const radarData = [
    { subject: 'Akademik natija', objectValue: student.scores.akademik.value, fullMark: student.scores.akademik.max },
    { subject: 'Davomat', objectValue: student.scores.davomat.value, fullMark: student.scores.davomat.max },
    { subject: 'Amaliy ko\'nikmalar', objectValue: student.scores.amaliy.value, fullMark: student.scores.amaliy.max },
    { subject: 'Faollik va Sert.', objectValue: student.scores.faollik.value, fullMark: student.scores.faollik.max },
    { subject: 'Tyutor bahosi', objectValue: student.scores.tyutorBahosi.value, fullMark: student.scores.tyutorBahosi.max },
    { subject: 'Intizom', objectValue: student.scores.intizom.value, fullMark: student.scores.intizom.max },
  ];

  const recentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getGrantTarget = () => {
    if (student.grantType === 'Unicorn') return { name: 'Unicorn', target: 80, current: student.scores.asosiyTotal, icon: <Sparkles className="w-5 h-5 text-purple-400" />, color: 'primary' };
    if (student.grantType === 'Golden Mind') return { name: 'Golden Mind', target: 85, current: student.scores.asosiyTotal, icon: <Brain className="w-5 h-5 text-amber-500" />, color: 'secondary' };
    return { name: 'Grant emas', target: 80, current: student.scores.asosiyTotal, icon: <Award className="w-5 h-5 text-emerald-500" />, color: 'primary'}
  };

  const target = getGrantTarget();
  const pointsNeeded = Math.max(0, target.target - target.current);
  const progressPercent = Math.min(100, Math.max(0, Math.round((target.current / target.target) * 100)));

  return (
    <div className="space-y-8 pb-10">
      {grantStatus.gpaWarning && (
        <div className="bg-[#FEF2F2] border border-[#DC2626]/20 p-4 rounded-[24px] flex items-center gap-4 animate-pulse shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
             <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-[14px] font-black tracking-tight text-red-900">⚠️ Akademik natija 80% dan past!</p>
            <p className="text-[13px] font-medium text-red-700/80">Keyingi semestrda grant to'xtatilishi mumkin. Zudlik bilan o'zlashtirishni yaxshilang.</p>
          </div>
        </div>
      )}

      {/* Hero Card */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-0"></div>
        
        <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] bg-emerald-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-200 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          {student.name.charAt(0)}
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left flex flex-col justify-center h-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">{student.name}</h1>
            {student.grantType !== 'None' && (
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                student.grantType === 'Unicorn' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              )}>
                {student.grantType === 'Unicorn' ? <Sparkles className="w-4 h-4" /> : <Brain className="w-4 h-4" />} {student.grantType} Granti
              </span>
            )}
          </div>
          <p className="text-slate-500 text-lg font-medium mb-6 italic">{student.year}-kurs talabasi • {student.studentId} • {student.group}-guruh</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/student/achievements" className="group inline-flex items-center px-6 py-3.5 bg-[#0A9B82] hover:bg-[#087D6A] text-white text-[12px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all shadow-lg shadow-[#0A9B82]/20 active:scale-95">
              <Award className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Yutuqlarimni yuklash
            </Link>
            <Link to="/student/scores" className="inline-flex items-center px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[12px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all active:scale-95">
              <Clock className="w-4 h-4 mr-2" /> Ballar tarixi
            </Link>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-[320px] bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-between items-center group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#0A9B82] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="space-y-1">
             <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#9DB4AB] mb-4">Yakuniy Ball</p>
             <div className="flex items-baseline gap-1">
               <span className="text-[52px] font-black text-[#0A9B82] tracking-tighter leading-none">{student.scores.finalScore}</span>
               <span className="text-2xl font-bold text-[#9DB4AB]/60">/100+</span>
             </div>
             <p className="text-[13px] font-medium italic text-[#6B8A80] mt-4">Asosiy ball: <span className="text-[#0D1F1A] font-bold">{student.scores.asosiyTotal}</span></p>
             <div className="flex items-center gap-4 mt-2">
               <p className="text-[12px] font-medium italic text-[#6B8A80]">Reyting: <span className="text-[#0D1F1A] font-bold">#3 / 24</span></p>
               <span className="w-1 h-1 rounded-full bg-[#E8EFED]" />
               <p className="text-[12px] font-medium italic text-[#6B8A80]">Bu oy: <span className="text-[#0A9B82] font-bold">+2.5</span></p>
             </div>
          </div>
          
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-[6px] border-[#F4F7F6]" />
            <div 
              className="absolute inset-0 rounded-full border-[6px] border-[#0A9B82] transition-all duration-1000" 
              style={{ clipPath: `inset(0 0 0 0)`, strokeDasharray: '251', strokeDashoffset: `${251 - (251 * (Math.min(100, student.scores.finalScore) / 100))}` }}
            />
            <div className="w-12 h-12 rounded-full bg-[#F8FFFE] flex items-center justify-center text-[#0A9B82] shadow-sm relative z-10">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart (6 axes) */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#0D1F1A] self-start mb-6">Asosiy Reyting (100 ball)</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#E8EFED" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B8A80', fontSize: 9, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8EFED', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
                  itemStyle={{ color: '#0D1F1A', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}
                  formatter={(value: number, name: string, props: any) => [`${value} / ${props.payload.fullMark}`, name]}
                />
                <Radar name="To'plangan" dataKey="objectValue" stroke="#0A9B82" strokeWidth={3} fill="#0A9B82" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-4">
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Akademik</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.akademik.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.akademik.max}</span></span>
            </Link>
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Davomat</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.davomat.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.davomat.max}</span></span>
            </Link>
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Amaliy</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.amaliy.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.amaliy.max}</span></span>
            </Link>
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Faollik</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.faollik.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.faollik.max}</span></span>
            </Link>
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Tyutor</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.tyutorBahosi.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.tyutorBahosi.max}</span></span>
            </Link>
            <Link to="/student/scores" className="bg-[#F4F7F6] p-3 rounded-2xl border border-transparent text-center transition-all hover:bg-white hover:shadow-md hover:border-[#0A9B82]/20 group">
              <span className="block text-[#9DB4AB] text-[9px] font-black uppercase tracking-widest mb-1 truncate">Intizom</span>
              <span className="text-lg font-black text-[#0D1F1A] group-hover:text-[#0A9B82] leading-none">{student.scores.intizom.value}<span className="text-xs text-[#9DB4AB]">/{student.scores.intizom.max}</span></span>
            </Link>
          </div>
        </div>

        {/* Grant Progress & Activity */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Progress */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-0"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-[#9DB4AB] flex items-center gap-3">
                  <div className="p-2 bg-[#F4F7F6] rounded-xl text-[#0A9B82]">{target.icon}</div>
                  Grant saqlab qolish uchun
                </h3>
                {pointsNeeded > 0 ? (
                  <p className="text-[#D97706] text-[13px] mt-4 font-black">⚠️ {pointsNeeded} ball kam! Ballaringizni oshiring.</p>
                ) : (
                  <p className="text-[#0A9B82] text-[13px] mt-4 font-black">🎉 {target.name} grant saqlab qolingan (+{target.current - target.target} zaxira)</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[32px] font-black text-[#0D1F1A] tracking-tighter">{target.current}</span>
                <span className="text-[16px] font-bold text-[#9DB4AB]"> / {target.target}</span>
              </div>
            </div>
            
            <div className="relative z-10 w-full h-3 bg-[#F4F7F6] rounded-full overflow-hidden mb-8 shadow-inner border border-[#E8EFED]">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercent}%` }}
                className={cn(
                  "h-full relative overflow-hidden",
                  pointsNeeded > 0 ? (pointsNeeded <= 5 ? "bg-[#D97706]" : "bg-[#DC2626]") : "bg-[#0A9B82]"
                )} 
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-1/2 animate-pulse"></div>
              </motion.div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F8FFFE] border border-[#E8EFED] p-6 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#9DB4AB] mb-4">Bonuslar (+)</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold text-[#6B8A80]">Bandlik bonusi</span>
                  <span className="text-[13px] font-black text-[#0A9B82]">+{student.scores.bonus.bandlikBonusi.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#6B8A80]">Reabilitatsiya</span>
                  <span className="text-[13px] font-black text-[#0A9B82]">+{student.scores.bonus.reabilitatsiya.value}</span>
                </div>
              </div>
              <div className="bg-[#FEF2F2]/50 border border-[#FEF2F2] p-6 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#DC2626]/60 mb-4">Jarimalar (-)</p>
                <div className="flex items-center justify-between">
                   <span className="text-[13px] font-bold text-[#991B1B]/80">Semestr davomida</span>
                   <span className="text-[13px] font-black text-[#DC2626]">{student.scores.bonus.jarimalar.value}</span>
                </div>
                <div className="mt-2 text-[11px] font-bold text-[#DC2626]/60">
                   Jarima chegarasi: {student.scores.bonus.jarimalar.value}/-20
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0D1F1A]">Oxirgi o'zgarishlar</h3>
              <Link to="/student/scores" className="group text-[#0A9B82] text-[10px] font-black uppercase tracking-[0.1em] hover:text-[#087D6A] transition-colors flex items-center">
                Tarix <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {recentChanges.length > 0 ? recentChanges.map(change => (
                <div key={change.id} className="flex gap-4 p-4 rounded-3xl hover:bg-[#F4F7F6] transition-all group border border-transparent">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm",
                    change.amount > 0 ? "bg-[#EDF7F4] text-[#0A9B82]" : "bg-[#FEF2F2] text-[#DC2626]"
                  )}>
                    {change.amount > 0 ? '+' : ''}{change.amount}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-[14px] text-[#0D1F1A] transition-colors">{change.reason}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">{change.category} • {new Date(change.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-[#9DB4AB] gap-4">
                   <Clock className="w-12 h-12 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-[0.1em]">Tarix bo'sh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

