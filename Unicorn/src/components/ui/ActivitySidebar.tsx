import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Award, Sparkles, CheckCircle2, ShieldAlert, Users, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

export default function ActivitySidebar() {
  const { isActivitySidebarOpen, setIsActivitySidebarOpen } = useAppContext();

  const activities = [
    { text: "Komendant 24 talaba borligini tasdiqladi", time: "5 daqiqa oldin", icon: Activity, color: "text-[#0A9B82] bg-[#EDF7F4]" },
    { text: "Sardor E. sertifikati tasdiqlandi (+4 ball)", time: "12 daqiqa oldin", icon: Award, color: "text-[#2563EB] bg-[#EFF6FF]" },
    { text: "Malika Y. yangi sertifikat yukladi", time: "18 daqiqa oldin", icon: Sparkles, color: "text-[#D97706] bg-[#FFFBEB]" },
    { text: "LMS sinxronizatsiyasi yakunlandi", time: "1 soat oldin", icon: CheckCircle2, color: "text-[#0A9B82] bg-[#EDF7F4]" },
    { text: "Yangi jarima qayd etildi: Bekzod O.", time: "2 soat oldin", icon: ShieldAlert, color: "text-[#DC2626] bg-[#FEF2F2]" },
    { text: "Yuridik fakulteti 3-kurs davomati: 94%", time: "3 soat oldin", icon: Users, color: "text-[#7C3AED] bg-[#F5F3FF]" },
    { text: "Tizim xabari: Server yangilandi", time: "5 soat oldin", icon: MessageSquare, color: "text-[#6B7280] bg-[#F3F4F6]" },
  ];

  return (
    <AnimatePresence>
      {isActivitySidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsActivitySidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[2000]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.1)] z-[2001] flex flex-col"
          >
            <div className="p-6 border-b border-[#E8EFED] flex justify-between items-center bg-[#F8FFFE]">
              <div>
                <h2 className="text-[18px] font-bold text-[#0D1F1A]">Tizim voqealari</h2>
                <p className="text-[12px] text-[#6B8A80] mt-0.5">Barcha so'nggi faoliyatlar</p>
              </div>
              <button 
                onClick={() => setIsActivitySidebarOpen(false)} 
                className="p-2 hover:bg-[#EDF7F4] rounded-full transition-colors text-[#9DB4AB] hover:text-[#0A9B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activities.map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 border-b border-[#F0F4F3] pb-4 group-last:border-0">
                    <p className="text-[14px] font-semibold text-[#1F3A34] leading-snug group-hover:text-[#0A9B82] transition-colors">{item.text}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[#9DB4AB] text-[11px] font-medium tracking-wide uppercase italic">
                      <Clock className="w-3 h-3" /> {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-[#E8EFED] bg-white">
              <button 
                onClick={() => setIsActivitySidebarOpen(false)} 
                className="w-full h-[44px] flex items-center justify-center bg-[#0A9B82] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#087A66] transition-all"
              >
                Yopish
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
