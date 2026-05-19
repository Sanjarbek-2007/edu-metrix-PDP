import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Award, Plus, Minus, History, CheckCircle, XCircle, Clock, TrendingUp, MessageSquare, ShieldAlert, Home, FileText, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    students, pointChanges, addPointChange, currentUser, 
    certificates, violations, updateCertificate, 
    messages, addMessage, achievements, updateAchievement 
  } = useAppContext();
  
  const student = students.find(s => s.id === id);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointForm, setPointForm] = useState({ type: 'add', category: 'faollik', amount: 5, reason: '' });
  const [activeTab, setActiveTab] = useState('score-log');
  const [newMessage, setNewMessage] = useState('');

  if (!student) return <div className="p-12 text-center text-text-muted">Talaba topilmadi</div>;

  const studentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const studentCerts = certificates.filter(c => c.studentId === student.id);
  const studentAchievements = achievements.filter(a => a.studentId === student.id);
  const studentViolations = violations.filter(v => v.studentId === student.id);
  const studentMessages = messages.filter(m => m.studentId === student.id);

  // Normalize for display in "Sertifikatlar" tab
  const allYutuqlar = [
    ...studentCerts.map(c => ({
      id: c.id,
      title: c.title,
      type: c.category || 'Sertifikat',
      organization: c.organization,
      date: c.date,
      status: c.status,
      points: c.pointsAwarded,
      rejectionReason: c.rejectionReason,
      itemType: 'certificate'
    })),
    ...studentAchievements.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      organization: a.result,
      date: a.date,
      status: a.status === 'tasdiqlangan' ? 'Approved' : a.status === 'rad_etilgan' ? 'Rejected' : 'Pending',
      points: a.points,
      itemType: 'achievement'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categoryNames: Record<string, string> = {
    akademik: 'Akademik',
    davomat: 'Davomat',
    amaliy: 'Amaliy ko\'n.',
    faollik: 'Faollik',
    tyutorBahosi: 'Tyutor',
    intizom: 'Intizom',
    jarima: 'Jarima (Bonus)',
    bandlik: 'Bandlik (Bonus)',
    reabilitatsiya: 'Reabilitatsiya'
  };

  const handlePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointForm.reason) {
      toast.error('Sababni ko\'rsatish shart');
      return;
    }
    
    addPointChange({
      studentId: student.id,
      category: pointForm.category as any,
      amount: pointForm.type === 'add' ? Number(pointForm.amount) : -Number(pointForm.amount),
      reason: pointForm.reason,
      approvedBy: currentUser?.name || 'Admin'
    });
    
    toast.success('Ball muvaffaqiyatli yangilandi');
    setShowPointModal(false);
    setPointForm({ type: 'add', category: 'faollik', amount: 5, reason: '' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    addMessage({
      studentId: student.id,
      senderId: currentUser?.id || 'admin',
      receiverId: student.id,
      subject: 'Ma\'muriyatdan xabar',
      content: newMessage,
    });
    
    setNewMessage('');
    toast.success('Xabar yuborildi');
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
            student.scores.finalScore >= 85 ? "text-emerald-600" : student.scores.finalScore >= 75 ? "text-amber-500" : "text-rose-600"
          )}>{student.scores.finalScore}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Akademik', value: student.scores.akademik.value, icon: Award, max: student.scores.akademik.max, color: 'bg-indigo-500' },
          { label: 'Davomat', value: student.scores.davomat.value, icon: Clock, max: student.scores.davomat.max, color: 'bg-amber-500' },
          { label: 'Amaliy ko\'nikmalar', value: student.scores.amaliy.value, icon: TrendingUp, max: student.scores.amaliy.max, color: 'bg-emerald-500' },
          { label: 'Faollik va Sert.', value: student.scores.faollik.value, icon: TrendingUp, max: student.scores.faollik.max, color: 'bg-purple-500' },
          { label: 'Tyutor bahosi', value: student.scores.tyutorBahosi.value, icon: TrendingUp, max: student.scores.tyutorBahosi.max, color: 'bg-blue-500' },
          { label: 'Intizom', value: student.scores.intizom.value, icon: CheckCircle, max: student.scores.intizom.max, color: 'bg-rose-500' },
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
              Ushbu talabaning hozirgi ko'rsatkichi {student.scores.asosiyTotal} ball (Asosiy). 
              {student.scores.asosiyTotal < 85 ? (
                <> Kelasi semestr uchun grantni saqlab qolishga yana kamida <span className="text-emerald-400 font-black not-italic">{85 - student.scores.asosiyTotal} ball</span> zarur.</>
              ) : (
                <> Talaba joriy mavsum uchun grant talablarini to'liq bajargan. Ballarni ushlab turish tavsiya etiladi.</>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full flex-wrap gap-1 border border-slate-200 shadow-inner">
            {[
              { id: 'score-log', name: 'Ballar tarixi' },
              { id: 'attendance', name: 'Davomat' },
              { id: 'certificates', name: 'Sertifikatlar' },
              { id: 'violations', name: 'Qoidabuzarliklar' },
              { id: 'room', name: 'Yotoqxona' },
              { id: 'messages', name: 'Xabarlar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex-1",
                  activeTab === tab.id ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'score-log' && (
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
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{categoryNames[change.category] || change.category} • Xodim: {change.approvedBy}</p>
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
              )}

              {activeTab === 'attendance' && (
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

              {activeTab === 'certificates' && (
                <motion.div key="certs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allYutuqlar.map(item => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-slate-900">{item.title}</h4>
                           <span className={cn(
                             "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                             item.status === 'Approved' ? "bg-emerald-100 text-emerald-600" : item.status === 'Rejected' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                           )}>{item.status === 'Approved' ? 'Tasdiqlangan' : item.status === 'Rejected' ? 'Rad etilgan' : 'Kutilmoqda'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{item.type} • {item.organization} • {item.date}</p>
                        
                        {item.status === 'Rejected' && item.rejectionReason && (
                          <p className="text-[10px] text-rose-600 font-medium mb-3 italic">Sabab: {item.rejectionReason}</p>
                        )}
                      </div>
                      
                      {item.status === 'Pending' && currentUser?.role === 'Admin' && (
                         <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                            <button 
                              onClick={() => {
                                if (item.itemType === 'certificate') {
                                  updateCertificate(item.id, { status: 'Approved', pointsAwarded: 5 });
                                } else {
                                  updateAchievement(item.id, 'tasdiqlangan', 5);
                                }
                                toast.success('Yutuq tasdiqlandi');
                              }} 
                              className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                              Tasdiqlash (+5)
                            </button>
                            <button 
                              onClick={() => {
                                if (item.itemType === 'certificate') {
                                  updateCertificate(item.id, { status: 'Rejected', rejectionReason: 'Mezonlarga javob bermaydi' });
                                } else {
                                  updateAchievement(item.id, 'rad_etilgan');
                                }
                                toast.success('Rad etildi');
                              }} 
                              className="flex-1 py-2 border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                              Rad etish
                            </button>
                         </div>
                      )}

                      {item.status === 'Approved' && (
                        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Berilgan ball: +{item.points || 0}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {allYutuqlar.length === 0 && <div className="col-span-2 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Yutuqlar va sertifikatlar yo'q</div>}
                </motion.div>
              )}

              {activeTab === 'violations' && (
                <motion.div key="violations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
                  {studentViolations.map(v => (
                    <div key={v.id} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
                       <div>
                          <p className="font-bold text-rose-900">{v.type}</p>
                          <p className="text-xs text-rose-600 mt-1">{v.description}</p>
                          <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-2">{v.date} • {v.reportedBy}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-rose-600">-{v.pointsDeducted}</p>
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">ball</p>
                       </div>
                    </div>
                  ))}
                  {studentViolations.length === 0 && <div className="py-20 text-center text-emerald-600 font-bold uppercase tracking-widest text-xs">Qoidabuzarliklar yo'q</div>}
                </motion.div>
              )}

              {activeTab === 'room' && (
                 <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 space-y-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Home className="w-8 h-8" /></div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Xona: {student.roomNumber || 'Yotoqxonada turmaydi'}</h4>
                          <p className="text-xs text-slate-500 font-medium italic">Yotoqxona intizomi va tozalik ko'rsatkichlari</p>
                       </div>
                    </div>
                    
                    {student.roomNumber && (
                       <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                             <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Tozalik</p>
                             <p className="text-lg font-black text-emerald-600">A+</p>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                             <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Navbatchilik</p>
                             <p className="text-lg font-black text-slate-900">100%</p>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                             <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Intizom</p>
                             <p className="text-lg font-black text-slate-900">8/10</p>
                          </div>
                       </div>
                    )}
                 </motion.div>
              )}

              {activeTab === 'messages' && (
                 <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                       {studentMessages.map(m => {
                          const isMine = m.senderId === currentUser?.id;
                          return (
                             <div key={m.id} className={cn("flex flex-col max-w-[80%]", isMine ? "self-end items-end" : "self-start items-start")}>
                                <div className={cn(
                                   "p-4 rounded-2xl text-sm shadow-sm",
                                   isMine ? "bg-slate-900 text-white rounded-br-none" : "bg-white text-slate-900 border border-slate-200 rounded-bl-none"
                                )}>
                                   {m.content}
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 font-bold">{new Date(m.timestamp).toLocaleTimeString()}</span>
                             </div>
                          )
                       })}
                       {studentMessages.length === 0 && <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Xabarlar tarixi bo'sh</div>}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                       <input 
                          type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                          placeholder="Xabar yozing..."
                          className="flex-1 h-11 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 text-sm font-medium focus:border-emerald-500 outline-none transition-all"
                       />
                       <button className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"><Send className="w-5 h-5" /></button>
                    </form>
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
                   {[
                      { id: 'akademik', name: 'Akademik' },
                      { id: 'davomat', name: 'Davomat' },
                      { id: 'amaliy', name: 'Amaliy ko\'n.' },
                      { id: 'faollik', name: 'Faollik' },
                      { id: 'tyutorBahosi', name: 'Tyutor' },
                      { id: 'intizom', name: 'Intizom' },
                      { id: 'jarima', name: 'Jarima (Bonus)' },
                      { id: 'bandlik', name: 'Bandlik (Bonus)' },
                      { id: 'reabilitatsiya', name: 'Reabilitatsiya' }
                   ].map(cat => (
                      <button
                        key={cat.id} type="button"
                        onClick={() => setPointForm({...pointForm, category: cat.id})}
                        className={cn(
                          "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95",
                          pointForm.category === cat.id 
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {cat.name}
                      </button>
                   ))}
                </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ball miqdori</label>
                     <span className="text-2xl font-black text-emerald-600">{pointForm.amount}</span>
                  </div>
                  
                  <div className="relative pt-4 pb-2">
                    <input 
                       type="range" 
                       min="1" max="50" 
                       value={pointForm.amount}
                       onChange={e => setPointForm({...pointForm, amount: parseInt(e.target.value) || 1})}
                       className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setPointForm({...pointForm, amount: Math.max(1, pointForm.amount - 1)})}
                      className="flex-1 py-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center gap-2 text-rose-600 font-black text-sm hover:bg-rose-100 transition-all active:scale-95"
                    >
                      <Minus className="w-5 h-5 shrink-0" /> Ayirish
                    </button>
                    <div className="w-20 relative group shrink-0">
                      <input 
                        type="number" min="1" max="50" required
                        value={pointForm.amount}
                        onChange={e => setPointForm({...pointForm, amount: Math.min(50, Math.max(1, parseInt(e.target.value) || 1))})}
                        className="w-full h-12 px-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-lg font-black text-slate-900 focus:border-emerald-500 outline-none shadow-sm transition-all text-center"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setPointForm({...pointForm, amount: Math.min(50, pointForm.amount + 1)})}
                      className="flex-1 py-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 text-emerald-600 font-black text-sm hover:bg-emerald-100 transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5 shrink-0" /> Qo'shish
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[1, 2, 5, 10, 15, 20, 50].map(val => (
                      <button 
                        key={val}
                        type="button"
                        onClick={() => setPointForm({...pointForm, amount: val})}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-black tracking-tight border transition-all flex-1 sm:flex-none",
                          pointForm.amount === val 
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" 
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                        )}
                      >
                        {val}
                      </button>
                    ))}
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
