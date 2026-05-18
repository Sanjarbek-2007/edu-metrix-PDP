import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileText, Plus, ExternalLink, XCircle, Send, Upload, Award } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Certificate } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Certificates() {
  const { currentUser, certificates, addCertificate } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const myCerts = certificates
    .filter(c => c.studentId === currentUser?.id)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !org || !desc) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate upload
    setTimeout(() => {
      addCertificate({
        studentId: currentUser!.id,
        title,
        organization: org,
        description: desc,
        status: 'Pending',
        uploadDate: new Date().toISOString(),
        studentName: currentUser!.name,
      });

      setIsSubmitting(false);
      setShowModal(false);
      setTitle('');
      setOrg('');
      setDesc('');
      setFile(null);
      toast.success("Sertifikat muvaffaqiyatli yuborildi. Tekshiruvdan so'ng ball beriladi.");
    }, 1500);
  };
  
  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Mening sertifikatlarim</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Amaliyot ballari uchun yutuqlaringizni yuklang</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl transition-all shadow-lg shadow-emerald-200 text-[10px] font-black uppercase tracking-widest active:scale-95"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Yangi yuklash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myCerts.map((cert: Certificate) => (
          <div key={cert.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className={cn(
                "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                cert.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                cert.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                'bg-rose-50 text-rose-600 border-rose-100'
              )}>
                {cert.status === 'Pending' ? 'Kutilmoqda' : cert.status === 'Approved' ? 'Tasdiqlandi' : 'Rad etildi'}
              </span>
            </div>
            
            <h3 className="font-black text-xl text-slate-900 mb-2 line-clamp-1 uppercase tracking-tighter group-hover:text-emerald-700 transition-colors">{cert.title}</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-8 line-clamp-2 italic leading-relaxed">{cert.description}</p>
            
            <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Tashkilot</span>
                <span className="text-slate-900">{cert.organization}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Sana</span>
                <span className="text-slate-900">{new Date(cert.uploadDate).toLocaleDateString()}</span>
              </div>
              
              {cert.status === 'Approved' && (
                <div className="w-full mt-4 bg-emerald-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-emerald-200">
                  +{cert.pointsAwarded} ball berildi
                </div>
              )}
              {cert.status === 'Rejected' && (
                <div className="w-full mt-4 bg-rose-50 text-rose-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-rose-100 px-4 group-relative cursor-help">
                  <span className="truncate block">Rad etish sababi: {cert.rejectionReason}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {myCerts.length === 0 && !showModal && (
          <div className="col-span-full py-24 text-center bg-white border border-slate-200 border-dashed rounded-[40px] flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Sizda hali yuklangan sertifikatlar mavjud emas.</p>
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

              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Sertifikat yuklash</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Amaliyot ko'rsatkichini oshirish</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sertifikat nomi</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Google Data Analytics Professional"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tashkilot</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Coursera, Udemy, Sololearn"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tavsif (yutuq haqida)</label>
                  <textarea 
                    placeholder="Siz bu kursda nimalarni o'rgandingiz..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Faylni yuklang (PDF, JPG)</label>
                  <div className="relative h-32 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Upload className="w-8 h-8 text-slate-300" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{file ? file.name : "Faylni tanlang yoki shu yerga tashlang"}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    disabled={isSubmitting}
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
