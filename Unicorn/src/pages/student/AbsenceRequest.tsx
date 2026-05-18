import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Clock, Calendar, FileText, Send, 
  CheckCircle2, XCircle, AlertCircle, MoonIcon,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function AbsenceRequest() {
  const { currentUser, absenceRequests, addAbsenceRequest } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('1 kecha');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentRequests = absenceRequests
    .filter(r => r.studentId === currentUser?.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addAbsenceRequest({
        studentId: currentUser!.id,
        studentName: currentUser!.name,
        date,
        duration,
        reason,
        status: 'Pending',
        submittedAt: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      setShowModal(false);
      setDate('');
      setDuration('1 kecha');
      setReason('');
      toast.success("So'rovingiz qabul qilindi. Komendant tasdiqlashini kuting.");
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Ruxsat so'rovlari</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Kechki payt tashqarida qolish uchun so'rov yuboring</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl transition-all shadow-lg shadow-emerald-200 text-[10px] font-black uppercase tracking-widest active:scale-95"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Yangi so'rov
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentRequests.map((req) => (
          <div key={req.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <MoonIcon className="w-5 h-5" />
              </div>
              <StatusBadge status={req.status} />
            </div>

            <h3 className="font-black text-lg text-slate-900 mb-4 uppercase tracking-tight">Tungi ruxsatnomasi</h3>
            
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-600">{new Date(req.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}dan boshlab</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-600">{req.duration}</span>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed line-clamp-2">
                  Sabab: {req.reason}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 mt-auto">
              {req.status === 'Approved' ? (
                <div className="p-3 bg-emerald-50 rounded-2xl flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tasdiqlandi</span>
                </div>
              ) : req.status === 'Rejected' ? (
                <div className="p-3 bg-rose-50 rounded-2xl flex flex-col gap-1 border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-600">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Rad etildi</span>
                  </div>
                  {req.note && <p className="text-[9px] text-rose-400 font-bold italic ml-6">{req.note}</p>}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-2xl flex items-center gap-2 text-amber-600 border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ko'rib chiqilmoqda</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {studentRequests.length === 0 && !showModal && (
          <div className="col-span-full py-20 bg-white border border-slate-100 border-dashed rounded-[40px] flex flex-col items-center justify-center text-slate-400 gap-4">
             <MoonIcon className="w-12 h-12 opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-widest">Hozircha ruxsat so'rovlari yo'q</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !isSubmitting && setShowModal(false)} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="w-full max-w-[500px] bg-white rounded-[40px] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Ruxsat so'rovi</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Ma'lumotlarni aniq ko'rsating</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ketish sanasi</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Muddat</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none appearance-none"
                  >
                    <option value="1 kecha">1 kecha</option>
                    <option value="2-3 kecha">2-3 kecha</option>
                    <option value="1 hafta (ta'til)">1 hafta (ta'til)</option>
                    <option value="Noaniq muddat">Noaniq muddat (og'ir vaziyat)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sabab (batafsil)</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Masalan: Uyga ketish, mehmonxonada qolish va h.k."
                    className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Yuborish <Send className="w-4 h-4 ml-1" /></>
                    )}
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

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100"
  } as any;
  
  const labels = {
    Pending: "KUTILMOQDA",
    Approved: "TASDIQLANGAN",
    Rejected: "RAD ETILGAN"
  } as any;

  return (
    <span className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border", styles[status])}>
      {labels[status]}
    </span>
  );
}
