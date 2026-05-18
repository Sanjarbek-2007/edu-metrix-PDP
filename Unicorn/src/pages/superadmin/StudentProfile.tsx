import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Award, Plus, Minus, History, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, pointChanges, addPointChange, currentUser } = useAppContext();
  
  const student = students.find(s => s.id === id);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointForm, setPointForm] = useState({ type: 'add', category: 'Xulq', amount: 5, reason: '' });
  const [activeTab, setActiveTab] = useState('score-log');

  if (!student) return <div className="p-12 text-center text-text-muted">Talaba topilmadi</div>;

  const studentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointForm.reason) {
      toast.error('Sababni ko\'rsatish shart');
      return;
    }
    
    addPointChange({
      studentId: student.id,
      category: pointForm.category as 'Baho'|'Davomat'|'Xulq'|'Amaliyot',
      amount: pointForm.type === 'add' ? Number(pointForm.amount) : -Number(pointForm.amount),
      reason: pointForm.reason,
      approvedBy: currentUser?.name || 'Admin'
    });
    
    toast.success('Ball muvaffaqiyatli yangilandi');
    setShowPointModal(false);
    setPointForm({ type: 'add', category: 'Xulq', amount: 5, reason: '' });
  };

  return (
    <div className="space-y-8 pb-10">
      <button onClick={() => navigate(-1)} className="group flex items-center text-xs font-black text-slate-400 hover:text-emerald-600 transition-all uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Orqaga qaytish
      </button>

      {/* Header Profile */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-black shadow-sm">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{student.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="bg-slate-100 px-2 py-1 rounded-md">ID: {student.studentId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="bg-slate-100 px-2 py-1 rounded-md">{student.year}-kurs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="bg-slate-100 px-2 py-1 rounded-md">{student.group}-guruh</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Jami Ball</p>
          <p className={cn(
            "text-5xl font-black tracking-tighter",
            student.totalScore >= 85 ? "text-emerald-600" : student.totalScore >= 75 ? "text-amber-500" : "text-rose-600"
          )}>{student.totalScore}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Akademik', value: student.scores.baho, icon: Award, max: 40, color: 'bg-indigo-500' },
          { label: 'Davomat', value: student.scores.davomat, icon: Clock, max: 25, color: 'bg-amber-500' },
          { label: 'Xulq-atvor', value: student.scores.xulq, icon: CheckCircle, max: 20, color: 'bg-emerald-500' },
          { label: 'Amaliyot', value: student.scores.amaliyot, icon: TrendingUp, max: 15, color: 'bg-indigo-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <stat.icon className="w-3.5 h-3.5" /> {stat.label}
            </p>
            <div className="flex items-end justify-between mb-4">
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-300">/{stat.max}</p>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                className={cn("h-full transition-all duration-1000", stat.color)} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Ma'muriy amallar</h3>
          <button 
            onClick={() => { setPointForm(prev => ({...prev, type: 'add', amount: 5})); setShowPointModal(true); }}
            className="w-full flex items-center justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all group shadow-sm active:scale-95"
          >
            <span className="font-black text-xs uppercase tracking-widest">Ball qo'shish</span>
            <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </button>
          <button 
            onClick={() => { setPointForm(prev => ({...prev, type: 'deduct', amount: 5})); setShowPointModal(true); }}
            className="w-full flex items-center justify-between p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 hover:bg-rose-600 hover:text-white transition-all group shadow-sm active:scale-95"
          >
            <span className="font-black text-xs uppercase tracking-widest">Ball ayirish</span>
            <Minus className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </button>

          <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Grant holati bo'limi
            </h4>
            <div className="text-xs font-medium leading-relaxed italic text-white/80">
              Ushbu talabaning hozirgi ko'rsatkichi {student.totalScore} ball. 
              {student.totalScore < 85 ? (
                <> Kelasi semestr uchun grantni saqlab qolishga yana kamida <span className="text-emerald-400 font-black not-italic">{85 - student.totalScore} ball</span> zarur.</>
              ) : (
                <> Talaba joriy mavsum uchun grant talablarini to'liq bajargan. Ballarni ushlab turish tavsiya etiladi.</>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('score-log')}
              className={cn(
                "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === 'score-log' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Ballar tarixi
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={cn(
                "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === 'attendance' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Davomat
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'score-log' ? (
                <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-slate-100">
                  {studentChanges.map(change => (
                    <div key={change.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border",
                          change.amount > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {change.amount > 0 ? '+' : ''}{change.amount}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{change.reason}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 mt-1">{change.category} • Xodim: {change.approvedBy}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 px-2 py-1 rounded-md">{new Date(change.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {studentChanges.length === 0 && (
                    <div className="p-20 text-center text-slate-400">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Ballar tarixi bo'sh.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="p-6 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                    <Clock className="w-16 h-16 text-slate-200" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-black uppercase tracking-tight text-lg">Davomat tizimi</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 font-medium italic leading-relaxed">Davomat ma'lumotlari PDP University LMS tizimidan har kuni kechasi avtomatik tarzda yangilanadi.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Point Change Modal */}
      <AnimatePresence>
        {showPointModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPointModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white p-10 rounded-[40px] border border-slate-200 relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                  <div className={cn(
                    "p-3 rounded-2xl shadow-sm",
                    pointForm.type === 'add' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {pointForm.type === 'add' ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                  </div>
                  Ballarni boshqarish
                </h3>
                <button 
                  onClick={() => setShowPointModal(false)} 
                  className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-xl"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
              
              <form onSubmit={handlePointSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategoriya</label>
                  <div className="grid grid-cols-2 gap-3">
                     {['Baho', 'Davomat', 'Xulq', 'Amaliyot'].map(cat => (
                        <button
                          key={cat} type="button"
                          onClick={() => setPointForm({...pointForm, category: cat})}
                          className={cn(
                            "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95",
                            pointForm.category === cat 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {cat}
                        </button>
                     ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ball miqdori</label>
                  <div className="relative">
                    <input 
                      type="number" min="1" max="50" required
                      value={pointForm.amount}
                      onChange={e => setPointForm({...pointForm, amount: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-slate-900 font-black text-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black uppercase text-xs">Ball</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sabab / Izoh</label>
                  <textarea 
                    required rows={3}
                    value={pointForm.reason}
                    onChange={e => setPointForm({...pointForm, reason: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner resize-none"
                    placeholder="Masalan: Olimpiadada faxrli o'rin egallagani uchun..."
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className={cn(
                      "w-full py-5 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95",
                      pointForm.type === 'add' 
                        ? "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700" 
                        : "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                    )}
                  >
                    O'zgarishlarni saqlash
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
