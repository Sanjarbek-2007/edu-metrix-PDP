import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  ArrowLeft, Award, Plus, Minus, History, CheckCircle, 
  XCircle, Clock, TrendingUp, FileText, ShieldAlert, 
  MessageSquare, User, Calendar, ExternalLink, ChevronRight,
  TrendingDown, AlertTriangle, CheckCircle2, Hash
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    students, pointChanges, addPointChange, currentUser, 
    certificates, violations, messages, addMessage 
  } = useAppContext();
  
  const student = students.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState<'Score' | 'Attendance' | 'Certificates' | 'Violations' | 'Messages'>('Score');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [pointForm, setPointForm] = useState({ category: 'Xulq', amount: 5, reason: '' });
  const [messageForm, setMessageForm] = useState({ subject: 'Tabriknoma', content: '' });

  if (!student) return <div className="p-12 text-center text-[#6B8A80]">Talaba topilmadi</div>;

  const studentChanges = pointChanges
    .filter(pc => pc.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const studentCerts = certificates.filter(c => c.studentId === student.id);
  const pendingCerts = studentCerts.filter(c => c.status === 'Pending');
  
  const studentViolations = violations.filter(v => v.studentId === student.id);
  const studentMessages = messages.filter(m => m.studentId === student.id);

  const handlePointSubmit = (type: 'add' | 'deduct') => {
    if (!pointForm.reason) {
      toast.error('Sababni ko\'rsatish shart');
      return;
    }
    
    addPointChange({
      studentId: student.id,
      category: pointForm.category as any,
      amount: type === 'add' ? Number(pointForm.amount) : -Number(pointForm.amount),
      reason: pointForm.reason,
      approvedBy: currentUser?.name || 'Admin'
    });
    
    toast.success('Ball muvaffaqiyatli yangilandi', {
      position: 'bottom-right',
      className: 'text-sm font-bold border-l-4 border-[#0A9B82]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#0A9B82]" />
    });
    
    setShowAddModal(false);
    setShowDeductModal(false);
    setPointForm({ category: 'Xulq', amount: 5, reason: '' });
  };

  const handleMessageSubmit = () => {
    if (!messageForm.content) {
      toast.error('Xabar mazmuni bo\'sh bo\'lishi mumkin emas');
      return;
    }

    addMessage({
      studentId: student.id,
      senderId: currentUser?.id || 'admin-1',
      receiverId: student.id,
      subject: messageForm.subject,
      content: messageForm.content
    });

    toast.success('Xabar muvaffaqiyatli yuborildi', {
      position: 'top-center',
      icon: '🚀'
    });

    setShowMessageModal(false);
    setMessageForm({ subject: 'Tabriknoma', content: '' });
    setActiveTab('Messages');
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2 px-6 py-3 text-[13px] font-bold transition-all border-b-2",
        activeTab === id 
          ? "border-[#0A9B82] text-[#0A9B82] bg-[#F4FDFB]" 
          : "border-transparent text-[#9DB4AB] hover:text-[#6B8A80] hover:bg-slate-50/50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center text-[13px] font-bold text-[#6B8A80] hover:text-[#0D1F1A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Orqaga qaytish
      </button>

      {/* Header Profile Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[14px] border border-[#E8EFED] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-[#EDF7F4] border border-[#0A9B82]/10 flex items-center justify-center text-[#0A9B82] text-3xl font-bold shadow-sm">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#0D1F1A] tracking-tight">{student.name}</h1>
              <span className={cn(
                "px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider",
                student.isRisk ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#EDF7F4] text-[#0A9B82]"
              )}>
                {student.isRisk ? "XAVF OSTIDA" : "YAXSHI HOLAT"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[13px] font-semibold text-[#6B8A80]">
              <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> ID: {student.studentId}</span>
              <span className="w-1 h-1 rounded-full bg-[#E8EFED]" />
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {student.year}-kurs</span>
              <span className="w-1 h-1 rounded-full bg-[#E8EFED]" />
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> {student.group}-guruh</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="h-9 px-4 bg-[#EDF7F4] text-[#0A9B82] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#0A9B82] hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Ball qo'shish
              </button>
              <button 
                onClick={() => setShowDeductModal(true)}
                className="h-9 px-4 bg-[#FEF2F2] text-[#DC2626] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#DC2626] hover:text-white transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" /> Ball ayirish
              </button>
              <button 
                onClick={() => setShowMessageModal(true)}
                className="h-9 px-4 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Xabar yuborish
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-[#E8EFED] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-2">Umumiy reyting bali</p>
            <div className="flex items-baseline gap-1">
              <p className={cn(
                "text-5xl font-black tracking-tighter",
                student.totalScore >= 85 ? "text-[#0A9B82]" : student.totalScore >= 75 ? "text-[#D97706]" : "text-[#DC2626]"
              )}>{student.totalScore}</p>
              <span className="text-xl font-bold text-[#9DB4AB]">/100</span>
            </div>
            <p className="text-[12px] text-[#6B8A80] font-medium mt-1 italic">Tizimdagi joriy o'rni: #12</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#F3F4F6] flex items-center justify-center relative">
            <svg className="w-16 h-16 absolute inset-0 -rotate-90">
              <circle 
                cx="32" cy="32" r="28" 
                fill="none" stroke="currentColor" 
                strokeWidth="4" 
                className={cn(
                  "transition-all duration-1000",
                  student.totalScore >= 85 ? "text-[#0A9B82]" : student.totalScore >= 75 ? "text-[#D97706]" : "text-[#DC2626]"
                )}
                strokeDasharray={`${(student.totalScore / 100) * 176} 176`}
              />
            </svg>
            <Award className={cn(
              "w-6 h-6",
              student.totalScore >= 85 ? "text-[#0A9B82]" : student.totalScore >= 75 ? "text-[#D97706]" : "text-[#DC2626]"
            )} />
          </div>
        </div>
      </div>

      {/* Pending Certificate Alert */}
      {pendingCerts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#92400E]">Ko'rib chiqilmagan sertifikat mavjud</p>
              <p className="text-[12px] text-[#B45309] font-medium">Talaba tomonidan yangi yutuq sertifikati yuklangan.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/certificates')}
            className="px-4 py-2 bg-[#D97706] text-white rounded-lg text-xs font-bold hover:bg-[#B45309] transition-all"
          >
            Ko'rib chiqish
          </button>
        </motion.div>
      )}

      {/* Main Tabs Segment */}
      <div className="bg-white rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar border-b border-[#E8EFED] bg-[#F8FFFE]">
          <TabButton id="Score" label="Ball tarixi" icon={History} />
          <TabButton id="Attendance" label="Davomat" icon={Clock} />
          <TabButton id="Certificates" label="Sertifikatlar" icon={FileText} />
          <TabButton id="Violations" label="Qoidabuzarliklar" icon={ShieldAlert} />
          <TabButton id="Messages" label="Xabarlar" icon={MessageSquare} />
        </div>

        <div className="p-6 h-[460px] overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'Score' && (
              <motion.div 
                key="score" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {studentChanges.map((change) => (
                  <div key={change.id} className="flex items-center justify-between p-4 bg-[#F8FFFE] border border-[#E8EFED] rounded-xl hover:border-[#0A9B82]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
                        change.amount > 0 ? "bg-[#EDF7F4] text-[#0A9B82]" : "bg-[#FEF2F2] text-[#DC2626]"
                      )}>
                        {change.amount > 0 ? `+${change.amount}` : change.amount}
                      </div>
                      <div>
                        <p className="font-bold text-[#0D1F1A] text-[14px]">{change.reason}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">{change.category}</span>
                          <span className="w-1 h-1 rounded-full bg-[#E8EFED]" />
                          <span className="text-[11px] font-medium text-[#6B8A80]">Xodim: {change.approvedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-[#0D1F1A]">{new Date(change.date).toLocaleDateString()}</p>
                      <p className="text-[11px] text-[#9DB4AB] font-medium">{new Date(change.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {studentChanges.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <History className="w-12 h-12 text-[#9DB4AB] opacity-20 mb-4" />
                    <p className="text-[14px] font-bold text-[#0D1F1A]">Hech qanday ma'lumot yo'q</p>
                    <p className="text-[12px] text-[#6B8A80] mt-1">Ushbu talaba uchun hali ballar tarixi mavjud emas.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Attendance' && (
              <motion.div 
                key="attendance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="h-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-[#9DB4AB] opacity-40" />
                </div>
                <h4 className="text-lg font-bold text-[#0D1F1A]">Davomat tizimi</h4>
                <p className="text-[13px] text-[#6B8A80] mt-2 max-w-sm mx-auto font-medium leading-relaxed">
                  Davomat ma'lumotlari PDP University LMS tizimidan har kuni kechasi avtomatik tarzda yangilanadi. Hozircha bu yerda ma'lumot yo'q.
                </p>
              </motion.div>
            )}

            {activeTab === 'Certificates' && (
              <motion.div 
                key="certs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {studentCerts.map((cert) => (
                  <div key={cert.id} className="p-4 bg-white border border-[#E8EFED] rounded-xl flex items-center justify-between group hover:border-[#0A9B82]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-[#9DB4AB] group-hover:bg-[#EDF7F4] group-hover:text-[#0A9B82] transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0D1F1A] text-[14px]">{cert.type} Sertifikati</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                            cert.status === 'Approved' ? "bg-[#EDF7F4] text-[#0A9B82]" : 
                            cert.status === 'Pending' ? "bg-[#FFFBEB] text-[#D97706]" : "bg-[#FEF2F2] text-[#DC2626]"
                          )}>
                            {cert.status === 'Approved' ? 'TASDIQLANGAN' : 
                             cert.status === 'Pending' ? 'KUTILMOQDA' : 'RAD ETILGAN'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[#E8EFED]" />
                          <span className="text-[11px] font-medium text-[#6B8A80]">{new Date(cert.uploadDate || cert.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-[#9DB4AB] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {studentCerts.length === 0 && (
                  <div className="col-span-full h-full flex flex-col items-center justify-center text-center py-20">
                    <FileText className="w-12 h-12 text-[#9DB4AB] opacity-20 mb-4" />
                    <p className="text-[14px] font-bold text-[#0D1F1A]">Hech qanday sertifikat yo'q</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Violations' && (
              <motion.div 
                key="violations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {studentViolations.map((v) => (
                  <div key={v.id} className="p-4 bg-[#FFF5F5] border border-[#FFE4E4] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#DC2626] font-bold text-sm shadow-sm">
                        -{v.finePoints || v.pointsDeducted}
                      </div>
                      <div>
                        <p className="font-bold text-[#0D1F1A] text-[14px]">{v.type === 'Late Night' ? 'Yotoqxona qoidasi' : v.type}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider">{v.severity === 'High' ? 'Jiddiy' : v.severity}</span>
                          <span className="w-1 h-1 rounded-full bg-[#FFE4E4]" />
                          <span className="text-[11px] font-medium text-[#B91C1C] truncate max-w-[300px]">{v.description}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#9DB4AB]">{new Date(v.date).toLocaleDateString()}</span>
                  </div>
                ))}
                {studentViolations.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <ShieldAlert className="w-12 h-12 text-[#0A9B82] opacity-20 mb-4" />
                    <p className="text-[14px] font-bold text-[#0D1F1A]">Talaba intizomli</p>
                    <p className="text-[12px] text-[#6B8A80] mt-1">Hech qanday qoidabuzarlik topilmadi.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Messages' && (
              <motion.div 
                key="messages" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {studentMessages.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => navigate('/admin/messages')}
                    className="p-4 bg-[#F8FFFE] border border-[#E8EFED] rounded-xl flex items-center gap-4 cursor-pointer hover:border-[#0A9B82]/30 group transition-all"
                  >
                    <div className="w-10 h-10 bg-white border border-[#E8EFED] rounded-lg flex items-center justify-center text-[#0A9B82] transition-transform group-hover:scale-105">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0D1F1A] text-[14px]">{m.subject}</p>
                      <p className="text-[12px] text-[#6B8A80] truncate mt-0.5">{m.content}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9DB4AB] group-hover:text-[#0A9B82] transition-colors" />
                  </div>
                ))}
                {studentMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <MessageSquare className="w-12 h-12 text-[#9DB4AB] opacity-20 mb-4" />
                    <p className="text-[14px] font-bold text-[#0D1F1A]">Xabarlar yo'q</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Point Change Modals */}
      <AnimatePresence>
        {(showAddModal || showDeductModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); setShowDeductModal(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[480px] bg-white rounded-2xl p-8 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#0D1F1A]">
                  {showAddModal ? "Ball qo'shish" : "Ball ayirish"}
                </h3>
                <button onClick={() => { setShowAddModal(false); setShowDeductModal(false); }} className="p-2 hover:bg-slate-50 rounded-full text-[#9DB4AB]">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Kategoriya</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Baho', 'Davomat', 'Xulq', 'Amaliyot'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setPointForm(prev => ({ ...prev, category: cat }))}
                        className={cn(
                          "py-2.5 rounded-lg border text-xs font-bold transition-all",
                          pointForm.category === cat ? "bg-[#EDF7F4] border-[#0A9B82] text-[#0A9B82]" : "border-[#D1D5DB] text-[#6B8A80] hover:bg-slate-50"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Ball miqdori</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPointForm(prev => ({ ...prev, amount: Math.max(1, prev.amount - 1) }))}
                      className="w-12 h-12 rounded-xl bg-[#F4F7F6] border border-[#E8EFED] flex items-center justify-center text-[#6B8A80] hover:bg-[#E2E8E5] transition-all shrink-0 active:scale-90"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="relative flex-1 group">
                      <input 
                        type="number" min="1" max="50" required
                        value={pointForm.amount}
                        onChange={e => setPointForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                        className="w-full h-12 px-5 bg-white border-2 border-[#E8EFED] rounded-[18px] text-xl font-black text-[#0D1F1A] focus:border-[#0A9B82] focus:bg-[#F8FFFE] outline-none shadow-sm transition-all text-center placeholder:text-[#9DB4AB]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#9DB4AB] uppercase tracking-widest pointer-events-none group-focus-within:text-[#0A9B82]">Ball</span>
                    </div>
                    <button 
                      onClick={() => setPointForm(prev => ({ ...prev, amount: Math.min(50, prev.amount + 1) }))}
                      className="w-12 h-12 rounded-xl bg-[#0A9B82] flex items-center justify-center text-white hover:bg-[#087D6A] transition-all shrink-0 shadow-lg shadow-[#0A9B82]/20 active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Preset Values */}
                  <div className="flex flex-wrap gap-2">
                    {[1, 5, 10, 20].map(val => (
                      <button 
                        key={val}
                        onClick={() => setPointForm(prev => ({ ...prev, amount: val }))}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[11px] font-black tracking-tight border transition-all",
                          pointForm.amount === val 
                            ? "bg-[#0A9B82] border-transparent text-white shadow-sm" 
                            : "bg-[#F4F7F6] border-[#E8EFED] text-[#6B8A80] hover:border-[#0A9B82]/40"
                        )}
                      >
                        +{val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Sabab / Izoh</label>
                  <textarea 
                    rows={4} 
                    value={pointForm.reason}
                    onChange={e => setPointForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Masalan: Kurs ishini muvaffaqiyatli topshirdi..."
                    className="w-full p-4 bg-white border border-[#D1D5DB] rounded-xl text-sm font-medium focus:border-[#0A9B82] outline-none shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-10">
                <button 
                  onClick={() => { setShowAddModal(false); setShowDeductModal(false); }}
                  className="h-11 px-6 text-[14px] font-bold text-[#6B8A80] hover:text-[#0D1F1A]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={() => handlePointSubmit(showAddModal ? 'add' : 'deduct')}
                  className={cn(
                    "h-11 px-8 rounded-xl text-[14px] font-bold shadow-lg shadow-[#0A9B82]/20 transition-all",
                    showAddModal ? "bg-[#0A9B82] text-white hover:bg-[#087D6A]" : "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-red-600/20"
                  )}
                >
                  {showAddModal ? "Ball qo'shish" : "Ball ayirish"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMessageModal(false)}
              className="absolute inset-0 bg-[#0D1F1A]/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[520px] bg-white rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="relative h-32 bg-gradient-to-br from-[#0A9B82] to-[#087D6A] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <button onClick={() => setShowMessageModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-[#0D1F1A] tracking-tight">Talabaga xabar yuborish</h3>
                  <p className="text-[13px] text-[#6B8A80] font-medium mt-1">Ushbu xabar talabaning shaxsiy kabinetida ko'rinadi.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-[0.1em] pl-1">Xabar mavzusi</label>
                    <select 
                      value={messageForm.subject}
                      onChange={e => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full h-14 px-5 bg-[#F4F7F6] border-2 border-transparent rounded-[18px] text-[15px] font-bold text-[#0D1F1A] focus:bg-white focus:border-[#0A9B82] outline-none transition-all"
                    >
                      <option value="Tabriknoma">🎉 Tabriknoma</option>
                      <option value="Ogohlantirish">⚠️ Ogohlantirish</option>
                      <option value="Eslatma">📅 Eslatma</option>
                      <option value="Ma'lumot">ℹ️ Ma'lumot</option>
                      <option value="Boshqa">📫 Boshqa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-[0.1em] pl-1">Xabar mazmuni</label>
                    <textarea 
                      rows={5} 
                      value={messageForm.content}
                      onChange={e => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Xabar matnini bu yerga yozing..."
                      className="w-full p-5 bg-[#F4F7F6] border-2 border-transparent rounded-[24px] text-[15px] font-medium text-[#0D1F1A] focus:bg-white focus:border-[#0A9B82] outline-none transition-all resize-none min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 h-14 rounded-2xl text-[15px] font-bold text-[#6B8A80] hover:bg-slate-50 transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    onClick={handleMessageSubmit}
                    className="flex-[2] h-14 bg-[#0A9B82] hover:bg-[#087D6A] text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-[#0A9B82]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <SendIcon className="w-5 h-5" />
                    Xabarni yuborish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}
