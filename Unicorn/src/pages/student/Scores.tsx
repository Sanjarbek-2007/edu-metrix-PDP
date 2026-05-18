import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { History, TrendingUp, TrendingDown, Clock, Shield, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Scores() {
  const { currentUser, pointChanges } = useAppContext();
  const studentId = currentUser?.id;
  
  const studentChanges = pointChanges
    .filter(pc => pc.studentId === studentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalAdded = studentChanges
    .filter(pc => pc.amount > 0)
    .reduce((sum, pc) => sum + pc.amount, 0);

  const totalDeducted = studentChanges
    .filter(pc => pc.amount < 0)
    .reduce((sum, pc) => sum + Math.abs(pc.amount), 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Ballar tarixi</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Sizning barcha ball o'zgarishlaringiz ro'yxati</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Akademik</p>
            <p className="text-3xl font-black text-slate-900">{currentUser?.scores.baho || 0}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Davomat</p>
            <p className="text-3xl font-black text-slate-900">{currentUser?.scores.davomat || 0}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Intizom</p>
            <p className="text-3xl font-black text-slate-900">{currentUser?.scores.xulq || 0}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amaliyot</p>
            <p className="text-3xl font-black text-slate-900">{currentUser?.scores.amaliyot || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Tranzaksiyalar jurnali</h3>
        </div>
        
        <div className="divide-y divide-slate-50">
          {studentChanges.map((change) => (
            <div key={change.id} className="p-8 hover:bg-slate-50 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-left">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-lg shadow-sm border",
                  change.amount > 0 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {change.amount > 0 ? '+' : ''}{change.amount}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{change.reason}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {change.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {new Date(change.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mas'ul xodim</p>
                 <p className="text-xs font-black text-slate-900 italic">Administratsiya</p>
              </div>
            </div>
          ))}
          
          {studentChanges.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-6">
              <Clock className="w-16 h-16 opacity-10" />
              <p className="text-sm font-black uppercase tracking-widest italic">Hozircha tranzaksiyalar yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}