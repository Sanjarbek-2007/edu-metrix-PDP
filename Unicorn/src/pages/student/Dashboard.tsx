import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Student } from '../../types';
import { Award, Clock, FileText, ChevronRight, Sparkles, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { currentUser, pointChanges } = useAppContext();
  const student = currentUser as Student;

  const radarData = [
    { subject: 'Baho (Grades)', A: student.scores.baho, fullMark: 40 },
    { subject: 'Davomat (Att.)', A: student.scores.davomat, fullMark: 25 },
    { subject: 'Xulq (Behav.)', A: student.scores.xulq, fullMark: 20 },
    { subject: 'Amaliyot (Prac.)', A: student.scores.amaliyot, fullMark: 15 },
  ];

  const recentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getGrantTarget = () => {
    if (student.year <= 2) return { name: 'Unicorn', target: 80, current: student.totalScore, icon: <Sparkles className="w-5 h-5 text-purple-400" />, color: 'primary' };
    return { name: 'Golden Mind', target: 85, current: student.totalScore, icon: <Brain className="w-5 h-5 text-amber-500" />, color: 'secondary' };
  };

  const target = getGrantTarget();
  const pointsNeeded = Math.max(0, target.target - target.current);
  const progressPercent = Math.min(100, Math.round((target.current / target.target) * 100));

  return (
    <div className="space-y-8 pb-10">
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
          <p className="text-slate-500 text-lg font-medium mb-6 italic">{student.year}-kurs talabasi • {student.roomNumber ? `${student.roomNumber}-xona` : 'Xonasiz'}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/student/certificates" className="group inline-flex items-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-95">
              <Award className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Sertifikat yuklash
            </Link>
            <Link to="/student/scores" className="inline-flex items-center px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
              <Clock className="w-4 h-4 mr-2" /> Ballar tarixi
            </Link>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-[320px] bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-between items-center group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#0A9B82] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#9DB4AB] mb-4">Umumiy Reyting Bali</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[52px] font-black text-[#0A9B82] tracking-tighter leading-none">{student.totalScore}</span>
              <span className="text-2xl font-bold text-[#9DB4AB]/60">/100</span>
            </div>
            <p className="text-[13px] font-medium italic text-[#6B8A80] mt-4">Tizimdagi joriy o'rni: <span className="text-[#0D1F1A] font-bold">#12</span></p>
          </div>
          
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple Medal Icon with Circular Ring */}
            <div className="absolute inset-0 rounded-full border-[6px] border-[#F4F7F6]" />
            <div 
              className="absolute inset-0 rounded-full border-[6px] border-[#0A9B82] transition-all duration-1000" 
              style={{ clipPath: `inset(0 0 0 0)`, strokeDasharray: '251', strokeDashoffset: '40' }} // Simulated progress
            />
            <div className="w-12 h-12 rounded-full bg-[#F8FFFE] flex items-center justify-center text-[#0A9B82] shadow-sm relative z-10">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 self-start mb-6">Ko'rsatkichlar tahlili</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Radar name="Ball" dataKey="A" stroke="#059669" fill="#10b981" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:shadow-md hover:border-emerald-200 group">
              <span className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Akademik</span>
              <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600">{student.scores.baho}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:shadow-md hover:border-emerald-200 group">
              <span className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Davomat</span>
              <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600">{student.scores.davomat}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:shadow-md hover:border-emerald-200 group">
              <span className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Intizom</span>
              <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600">{student.scores.xulq}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:shadow-md hover:border-emerald-200 group">
              <span className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Amaliyot</span>
              <span className="text-xl font-black text-slate-900 group-hover:text-emerald-600">{student.scores.amaliyot}</span>
            </div>
          </div>
        </div>

        {/* Grant Progress & Activity */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Progress */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-0"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">{target.icon}</div>
                  {target.name} Granti uchun Eligibility
                </h3>
                {pointsNeeded > 0 ? (
                  <p className="text-slate-500 text-xs mt-3 font-medium italic leading-relaxed">Sizga grantni qo'lga kiritish uchun yana <span className="font-black text-emerald-600 not-italic">{pointsNeeded} ball</span> zarur.</p>
                ) : (
                  <p className="text-emerald-600 text-xs mt-3 font-black uppercase tracking-widest">Tabriklaymiz! Siz minimal talabni bajardingiz.</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{progressPercent}%</span>
              </div>
            </div>
            
            <div className="relative z-10 w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner border border-slate-200/50">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercent}%` }}
                className="h-full bg-emerald-600 relative overflow-hidden" 
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-1/2 animate-pulse"></div>
              </motion.div>
            </div>

            {pointsNeeded > 0 && (
              <div className="relative z-10 bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Qanday qilib ball toplash mumkin:</p>
                <ul className="space-y-4">
                  {(40 - student.scores.baho) > 0 && (
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      LMS orqali baholarni yaxshilang (maksimal {40 - student.scores.baho} ball imkoniyati)
                    </li>
                  )}
                  {(15 - student.scores.amaliyot) > 0 && (
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Yangi <Link to="/student/certificates" className="text-emerald-600 hover:underline">sertifikatlar yuklang</Link> (maksimal {15 - student.scores.amaliyot} ball imkoniyati)
                    </li>
                  )}
                  {(20 - student.scores.xulq) > 0 && (
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Qoidabuzarliklarga yo'l qo'ymang va intizom ballini saqlang
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Oxirgi o'zgarishlar</h3>
              <Link to="/student/scores" className="group text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center">
                Barchasini ko'rish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {recentChanges.length > 0 ? recentChanges.map(change => (
                <div key={change.id} className="flex gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm shadow-sm border",
                    change.amount > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                  )}>
                    {change.amount > 0 ? '+' : ''}{change.amount}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{change.reason}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{change.category} • {new Date(change.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                   <Clock className="w-12 h-12 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Hozircha o'zgarishlar yo'q</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
