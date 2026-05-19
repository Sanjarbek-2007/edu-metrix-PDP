import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Award, Upload, Plus, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function StudentAchievements() {
  const { currentUser, addAchievement, achievements } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Tarix' | 'Yangi'>('Tarix');
  
  // Form states
  const [category, setCategory] = useState<'Sertifikat' | 'Musobaqa' | 'Loyiha' | 'Mentorlik' | 'Volontyorlik' | 'Bandlik'>('Sertifikat');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const studentAchievements = (achievements || [])
    .filter(a => a.studentId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !details || (!file && category !== 'Mentorlik')) {
      toast.error('Barcha maydonlarni to\'ldiring va tasdiq faylini yuklang');
      return;
    }
    
    addAchievement({
      studentId: currentUser?.id || '',
      type: category,
      title: title,
      result: details.slice(0, 50),
      points: 0,
      status: 'kutilmoqda',
      date: new Date().toISOString().split('T')[0]
    });

    toast.success('Yutuq muvaffaqiyatli yuborildi. Ma\'muriyat tekshiruvidan so\'ng ball qo\'shiladi.');
    setActiveTab('Tarix');
    setTitle('');
    setDetails('');
    setFile(null);
  };

  const getPointsEstimate = () => {
     switch(category) {
        case 'Sertifikat': return '2 - 8 ball';
        case 'Musobaqa': return '1 - 3 ball';
        case 'Loyiha': return 'gacha 7 ball';
        case 'Mentorlik': return '3 ball';
        case 'Volontyorlik': return '1 - 2 ball';
        case 'Bandlik': return '0 - 10 bonus ball';
        default: return '0 ball';
     }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Yutuqlarim va Faolliklarim</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">O'z yutuqlaringizni yuklang va reyting ballingizni oshiring</p>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-[#F4F7F6] rounded-2xl w-full max-w-[300px]">
         <button onClick={() => setActiveTab('Tarix')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all", activeTab === 'Tarix' ? "bg-white text-[#0A9B82] shadow-sm" : "text-[#9DB4AB] hover:text-[#6B8A80]")}>Tarix</button>
         <button onClick={() => setActiveTab('Yangi')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all gap-2 flex items-center justify-center", activeTab === 'Yangi' ? "bg-white text-[#0A9B82] shadow-sm" : "text-[#9DB4AB] hover:text-[#6B8A80]")}><Plus className="w-4 h-4"/> Yangi qo'shish</button>
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'Yangi' && (
            <motion.div key="yangi" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
               <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm space-y-6 max-w-3xl">
                  <div className="flex items-start gap-4 p-4 bg-[#F8FFFE] border border-[#E8EFED] rounded-2xl">
                     <AlertCircle className="w-6 h-6 text-[#0A9B82] shrink-0" />
                     <div>
                        <h4 className="font-bold text-[#0D1F1A]">Taxminiy ball: {getPointsEstimate()}</h4>
                        <p className="text-xs font-medium text-[#6B8A80] mt-1">Yutuq turiga qarab ballar admin tomonidan belgilanadi. Noto'g'ri yoki qalbaki hujjat yuklash intizomiy choraga (jarimaga) olib kelishi mumkin.</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[13px] font-bold text-[#0D1F1A]">Yutuq turi</label>
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full h-14 bg-[#F4F7F6] border-none rounded-xl px-4 text-[#0D1F1A] text-sm font-medium focus:ring-2 focus:ring-[#0A9B82]/20 outline-none transition-all"
                     >
                        <option value="Sertifikat">Sertifikat (IT, Til, va h.k.)</option>
                        <option value="Musobaqa">Musobaqa / Xakaton</option>
                        <option value="Loyiha">Loyiha / Startup (O'z g'oyangiz)</option>
                        <option value="Mentorlik">Mentorlik (Boshqa talabaga yordam)</option>
                        <option value="Volontyorlik">Ijtimoiy faollik / Volontyorlik</option>
                        <option value="Bandlik">Ishga joylashish (Bonus ball)</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[13px] font-bold text-[#0D1F1A]">Nomi (Yutuqning qisqacha nomi)</label>
                     <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masalan: IELTS 7.5, yoki IT Park Hackathon..."
                        className="w-full h-14 bg-[#F4F7F6] border-none rounded-xl px-4 text-[#0D1F1A] text-sm font-medium focus:ring-2 focus:ring-[#0A9B82]/20 outline-none transition-all"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[13px] font-bold text-[#0D1F1A]">Qo'shimcha ma'lumot va Natija</label>
                     <textarea 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Tashkilotchi ismi, egallan o'rin, sana va boshqa tafsilotlarni yozing..."
                        className="w-full min-h-[120px] bg-[#F4F7F6] border-none rounded-xl p-4 text-[#0D1F1A] text-sm font-medium focus:ring-2 focus:ring-[#0A9B82]/20 outline-none transition-all resize-none"
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[13px] font-bold text-[#0D1F1A]">Tasdiqlovchi hujjat (PDF yoki Rasm) {category !== 'Mentorlik' && <span className="text-red-500">*</span>}</label>
                     <div className="w-full border-2 border-dashed border-[#E8EFED] rounded-2xl p-8 flex flex-col items-center justify-center bg-[#F4F7F6] hover:bg-slate-50 transition-colors cursor-pointer relative group">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".pdf,.png,.jpg,.jpeg" />
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                           <Upload className="w-6 h-6 text-[#0A9B82]" />
                        </div>
                        <p className="text-sm font-bold text-[#0D1F1A] mb-1">{file ? file.name : "Faylni bu yerga tashlang yoki tanlang"}</p>
                        <p className="text-xs text-[#9DB4AB] font-medium">Maksimal hajm: 5MB</p>
                     </div>
                  </div>

                  <button type="submit" className="w-full h-14 bg-[#0A9B82] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0A9B82]/20 hover:bg-[#087D6A] transition-all active:scale-[0.98]">
                     Ma'lumotlarni yuborish
                  </button>
               </form>
            </motion.div>
         )}

         {activeTab === 'Tarix' && (
            <motion.div key="tarix" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
               <div className="bg-white rounded-[24px] border border-[#E8EFED] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead className="bg-[#F8FFFE] border-b border-[#E8EFED]">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Yutuq nomi & Turi</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB]">Sana</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB] text-center">Holat</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#9DB4AB] text-right">Ball</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#E8EFED]">
                        {studentAchievements.map(item => (
                           <tr key={item.id} className="hover:bg-[#F8FFFE] transition-colors">
                              <td className="px-6 py-4">
                                 <p className="font-bold text-[#0D1F1A]">{item.title}</p>
                                 <p className="text-[11px] font-black uppercase tracking-widest text-[#9DB4AB] mt-1">{item.type}</p>
                              </td>
                              <td className="px-6 py-4 text-[13px] font-medium text-[#6B8A80]">{item.date}</td>
                              <td className="px-6 py-4 text-center">
                                 {item.status === 'tasdiqlangan' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF7F4] text-[#0A9B82] rounded-lg text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Tasdiqlangan</span>}
                                 {item.status === 'kutilmoqda' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEB] text-[#D97706] rounded-lg text-[10px] font-black uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> Kutilmoqda</span>}
                                 {item.status === 'rad_etilgan' && (
                                    <div className="flex flex-col items-center gap-1">
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] text-[#DC2626] rounded-lg text-[10px] font-black uppercase tracking-widest"><XCircle className="w-3.5 h-3.5" /> Rad etilgan</span>
                                    </div>
                                 )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className={cn(
                                    "text-lg font-black",
                                    item.status === 'tasdiqlangan' ? "text-[#0A9B82]" : item.status === 'rad_etilgan' ? "text-[#DC2626] opacity-50" : "text-[#D97706]"
                                 )}>{item.status === 'tasdiqlangan' ? `+${item.points}` : item.status === 'rad_etilgan' ? '0' : '?'}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
