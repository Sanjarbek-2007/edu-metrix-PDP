import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trophy, Search, Medal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function PublicRating() {
  const { students } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sort students by totalScore descending
  const sortedStudents = [...students].sort((a, b) => b.totalScore - a.totalScore);

  const filteredStudents = sortedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.group.includes(searchTerm)
  );

  // Anonymize names (First Initial + Last Name)
  const anonymizeName = (name: string) => {
     const parts = name.split(' ');
     if (parts.length > 1) {
         return `${parts[0].charAt(0)}. ${parts[1]}`;
     }
     return name;
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-12">
      {/* Guest Banner */}
      <div className="bg-[#087D6A] text-white py-3 px-4 flex justify-between items-center z-50 relative shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span>👁️ Mehmon rejimi</span>
                <span className="hidden md:inline text-white/50">•</span>
                <span className="text-white/80 font-medium">Faqat ko'rish</span>
            </span>
        </div>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-white text-[#087D6A] text-xs font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-slate-50 transition-colors">Tizimga kirish</button>
      </div>

      {/* Header */}
      <div className="bg-[#0A9B82] pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 left-0">
               <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
               >
                   <ArrowLeft className="w-5 h-5" />
                   <span className="text-sm font-semibold">Orqaga qaytish</span>
               </button>
            </div>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-xl">
                <Trophy className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Global Reyting
            </h1>
            <p className="text-white/80 text-lg font-medium max-w-lg">
                Talabalarning akademik va amaliy natijalari bo'yicha umumiy reytingi. Top 100 yuksak natijalar.
            </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E8EFED] p-6 mb-8">
            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Ism yoki guruh bo'yicha qidiruv..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F7F6] border-2 border-transparent focus:border-[#0A9B82] rounded-xl text-gray-900 font-medium transition-all outline-none"
                />
            </div>
        </div>

        <div className="space-y-4">
            {filteredStudents.map((student, index) => {
                const isTop3 = index < 3 && !searchTerm;
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={student.id} 
                        className={cn(
                            "bg-white rounded-2xl border border-[#E8EFED] p-4 flex items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow",
                            isTop3 ? "border-[#0A9B82]/30 shadow-[#0A9B82]/5" : ""
                        )}
                    >
                        <div className="w-12 text-center shrink-0 flex flex-col items-center">
                            {index === 0 && <Medal className="w-8 h-8 text-[#FFD700] mb-1" />}
                            {index === 1 && <Medal className="w-7 h-7 text-[#C0C0C0] mb-1" />}
                            {index === 2 && <Medal className="w-6 h-6 text-[#CD7F32] mb-1" />}
                            {index > 2 && <span className="text-lg font-black text-gray-400">#{index + 1}</span>}
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#E8EFED]">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} alt={student.name} />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg truncate">{anonymizeName(student.name)}</h3>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{student.group}</p>
                            </div>
                            <div className="flex items-center gap-6 text-right">
                                <div className="hidden sm:block">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Grant holati</span>
                                    <span className="text-sm font-bold text-gray-700">{student.grantType === 'None' ? '-' : student.grantType}</span>
                                </div>
                                <div className="bg-[#EDF7F4] px-4 py-2 rounded-xl text-center min-w-[80px]">
                                    <span className="text-[10px] font-bold text-[#0A9B82] uppercase tracking-widest leading-none">Ball</span>
                                    <p className="text-xl font-black text-[#0D1F1A] leading-none mt-1">{student.totalScore}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
            
            {filteredStudents.length === 0 && (
                <div className="bg-white p-12 rounded-2xl text-center border border-[#E8EFED]">
                    <p className="text-gray-500 font-medium">Talaba topilmadi</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
