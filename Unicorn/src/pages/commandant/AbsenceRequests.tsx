import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  FileText, CheckCircle2, XCircle, Search, 
  Calendar, Moon, Clock, User, Filter, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function AbsenceRequests() {
  const { students, absenceRequests, updateAbsenceRequest } = useAppContext();
  const [activeTab, setActiveTab] = useState('Barchasi');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const stats = [
    { label: 'Kutilmoqda', value: absenceRequests.filter(r => r.status === 'Pending').length, color: 'text-[#FFB800]' },
    { label: 'Tasdiqlangan (bu oy)', value: absenceRequests.filter(r => r.status === 'Approved').length, color: 'text-[#0A9B82]' },
    { label: 'Rad etilgan (bu oy)', value: absenceRequests.filter(r => r.status === 'Rejected').length, color: 'text-[#DC2626]' },
    { label: 'Jami so\'rovlar', value: absenceRequests.length, color: 'text-[#0D1F1A]' },
  ];

  const filteredRequests = absenceRequests.filter(v => {
    if (activeTab === 'Barchasi') return true;
    if (activeTab === 'Kutilmoqda' && v.status === 'Pending') return true;
    if (activeTab === 'Tasdiqlangan' && v.status === 'Approved') return true;
    if (activeTab === 'Rad etilgan' && v.status === 'Rejected') return true;
    return false;
  });

  const handleApprove = (id: string) => {
    updateAbsenceRequest(id, 'Approved', 'Tasdiqlandi');
    toast.success("✓ Ruxsat so'rovi tasdiqlandi");
  };

  const handleReject = () => {
    if (!rejectionReason) {
      toast.error("Rad etish sababini yozing");
      return;
    }
    updateAbsenceRequest(selectedRequest.id, 'Rejected', rejectionReason);
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
    toast.success("Ruxsat so'rovi rad etildi");
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Ruxsat so'rovlari</h1>
          <p className="text-[13px] text-[#6B8A80] font-medium mt-0.5">Talabalar tungi ruxsat so'rovlari</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[14px] border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 border-b border-[#E8EFED]">
        {['Barchasi', 'Kutilmoqda', 'Tasdiqlangan', 'Rad etilgan'].map((tab) => {
           const count = tab === 'Barchasi' ? absenceRequests.length : 
                         tab === 'Kutilmoqda' ? absenceRequests.filter(r => r.status === 'Pending').length :
                         tab === 'Tasdiqlangan' ? absenceRequests.filter(r => r.status === 'Approved').length :
                         absenceRequests.filter(r => r.status === 'Rejected').length;
           return (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-4 py-3 text-[14px] font-bold transition-all border-b-2 flex items-center gap-2",
                 activeTab === tab ? "border-[#0A9B82] text-[#0A9B82]" : "border-transparent text-[#6B8A80]"
               )}
             >
               {tab} <span className={cn(
                 "px-1.5 py-0.5 rounded-full text-[10px] font-black",
                 activeTab === tab ? "bg-[#0A9B82] text-white" : "bg-[#F4F7F6] text-[#9DB4AB]"
               )}>{count}</span>
             </button>
           );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const student = students.find(s => s.id === req.studentId);
          return (
            <div key={req.id} className={cn(
              "bg-white rounded-[14px] border border-[#E8EFED] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all",
              req.status === 'Pending' ? "border-l-[3px] border-l-[#FFB800]" :
              req.status === 'Approved' ? "border-l-[3px] border-l-[#0A9B82]" :
              "border-l-[3px] border-l-[#DC2626]"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f9f1] flex items-center justify-center text-[#0A9B82] font-bold text-[14px]">
                    {student?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0D1F1A]">{student?.name}</h4>
                    <p className="text-[12px] text-[#6B8A80] font-medium">{student?.roomNumber} · {student?.year}-kurs</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="space-y-4 py-4 border-y border-[#F0F4F3] mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#0A9B82]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Sana:</p>
                    <p className="text-[13px] font-bold text-[#0D1F1A]">{new Date(req.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-[#7C3AED]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Muddat:</p>
                    <p className="text-[13px] font-bold text-[#0D1F1A]">{req.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#6B8A80]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">Sabab:</p>
                    <p className="text-[13px] font-bold text-[#0D1F1A]">{req.reason}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9DB4AB]">
                  <Clock className="w-3.5 h-3.5" />
                  So'rov vaqti: {new Date(req.submittedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {req.status === 'Pending' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 h-9 bg-rose-50 text-[#DC2626] border border-[#DC2626]/20 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Rad etish
                  </button>
                  <button 
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 h-9 bg-[#0A9B82] text-white rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#087D6A] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Tasdiqlash ✓
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-[#F8FFFE] rounded-lg border border-[#E8EFED]">
                  <p className="text-[12px] font-bold text-[#0D1F1A]">
                    {req.status === 'Approved' ? 'Tasdiqlov' : 'Rad etish'} sababi:
                  </p>
                  <p className="text-[12px] text-[#6B8A80] mt-1 italic">
                    {req.note || (req.status === 'Approved' ? 'Tasdiqlangan' : 'Sabab ko\'rsatilmagan')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-[420px] bg-white rounded-2xl p-8 relative z-10 shadow-2xl">
              <h3 className="text-xl font-bold text-[#0D1F1A] mb-2 text-center">Ruxsatni rad etish</h3>
              <p className="text-[14px] text-[#6B8A80] text-center mb-6 font-medium">
                {selectedRequest?.studentName} uchun so'rovni rad etish sababini ko'rsating.
              </p>
              
              <div className="space-y-2 mb-8">
                <label className="text-[13px] font-bold text-[#0D1F1A]">Rad etish sababi:</label>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nima uchun rad etilayotganini yozing..." 
                  className="w-full p-4 bg-[#F4F7F6] border-none rounded-xl text-[14px] font-medium text-[#0D1F1A] outline-none min-h-[120px] resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="h-11 rounded-xl text-[14px] font-bold text-[#6B8A80] hover:bg-slate-50 border border-[#E8EFED]"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleReject}
                  className="h-11 rounded-xl text-[14px] font-bold bg-[#DC2626] text-white hover:bg-rose-700 shadow-lg shadow-rose-900/10"
                >
                  Rad etish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Pending: "bg-[#FFFBEB] text-[#FFB800] border-[#FFB800]/20",
    Approved: "bg-[#EDF7F4] text-[#0A9B82] border-[#0A9B82]/20",
    Rejected: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20"
  } as any;
  
  const labels = {
    Pending: "KUTILMOQDA",
    Approved: "TASDIQLANGAN",
    Rejected: "RAD ETILGAN"
  } as any;

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border", styles[status])}>
      {labels[status]}
    </span>
  );
}
