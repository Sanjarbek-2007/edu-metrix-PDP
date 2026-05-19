import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Save, ArrowLeft, User, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function MentorEvaluate() {
  const { id } = useParams();
  const { students, currentUser, addTyutorEvaluation } = useAppContext();
  const navigate = useNavigate();
  
  const student = students.find(s => s.id === id);

  const [scores, setScores] = useState({
    korporativ: 0.5,
    ijtimoiy: 0.5,
    softSkills: 0.5,
    intizom: 0.5,
    yotoqxona: 0.5
  });

  const [comments, setComments] = useState({
    korporativ: '',
    ijtimoiy: '',
    softSkills: '',
    intizom: '',
    yotoqxona: ''
  });

  const [generalFeedback, setGeneralFeedback] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  if (!student) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Talaba topilmadi.</h2>
        <button onClick={() => navigate('/mentor/students')} className="mt-4 text-[#0A9B82] font-bold">Ortga qaytish</button>
      </div>
    );
  }

  const totalScore = Object.values(scores).reduce<number>((a: number, b: number) => a + Number(b), 0);
  const isFormValid = generalFeedback.length >= 50;
  const currentPeriod = new Date().toLocaleDateString('uz', { month: 'long', year: 'numeric' });

  const prevScore = student.scores.tyutorBahosi.value;
  const diff = totalScore - prevScore;

  const handleSaveAttempt = () => {
    if (!isFormValid) {
        toast.error("Iltimos, umumiy izohga kamida 50 ta belgi kiriting.");
        return;
    }
    setShowConfirm(true);
  };

  const confirmSave = () => {
    addTyutorEvaluation({
      studentId: student.id,
      mentorId: currentUser?.id || 'm1',
      period: currentPeriod,
      scores: {
        korporativMadaniyat: scores.korporativ,
        ijtimoiyFaollik: scores.ijtimoiy,
        softSkills: scores.softSkills,
        intizom: scores.intizom,
        yotoqxonaHayot: scores.yotoqxona
      },
      totalPoints: totalScore,
      notes: generalFeedback,
      date: new Date().toISOString().split('T')[0]
    });

    toast.success(`✓ Baholash saqlandi. ${student.name}ning tyutor bahosi: ${totalScore.toFixed(2)}/5 olaroq yangilandi.`);
    navigate('/mentor/students');
  };

  const getStrokeColor = (val: number) => {
    if (val < 2.5) return '#DC2626';
    if (val < 3.5) return '#F59E0B';
    if (val < 4.5) return '#0A9B82';
    return '#065F46';
  };
  
  const getLabelForScore = (val: number) => {
    if (val < 2.0) return "Talabaga e'tibor qaratish tavsiya etiladi";
    if (val < 3.0) return "Qoniqarli natija";
    if (val < 4.0) return "Yaxshi natija";
    if (val < 4.5) return "A'lo natija";
    return "Ajoyib natija! ⭐";
  };

  const criteria = [
    { id: 'korporativ', label: 'Korporativ madaniyat va Etika', desc: 'Dress-code, muloqot madaniyati, o\'zini tutishi' },
    { id: 'ijtimoiy', label: 'Ijtimoiy va Ma\'naviy faollik', desc: 'Tadbirlarda ishtirok, jamoat ishlari' },
    { id: 'softSkills', label: 'Soft Skills va Rivojlanish', desc: 'Kommunikatsiya, motivatsiya, workshop ishtirok' },
    { id: 'intizom', label: 'Intizom va Mas\'uliyat', desc: 'Topshiriqlar ijrosi, vaqtni boshqarish, uchrashuvlarga kelish' },
    { id: 'yotoqxona', label: 'Yotoqxona va Universitet hayoti', desc: 'Tozalik, navbatchilik, hamjihatlik (o\'rtacha 0.5)' },
  ];

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-[#9DB4AB]"/></button>
          <div>
            <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Tyutor baholash</h1>
            <p className="text-[13px] text-[#0A9B82] mt-1 font-bold">Baholash davri: {currentPeriod}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8EFED] p-6 shadow-sm">
         <div className="flex items-center gap-6 pb-6 border-b border-[#E8EFED]">
           <div className="w-16 h-16 rounded-full bg-[#EDF7F4] flex items-center justify-center text-[#0A9B82] font-black text-2xl border-2 border-[#0A9B82]/20">
              {student.name.charAt(0)}
           </div>
           <div className="flex-1">
              <h2 className="text-xl font-bold text-[#0D1F1A]">{student.name}</h2>
              <p className="text-sm font-medium text-[#6B8A80]">{student.group}-guruh</p>
           </div>
         </div>
         <div className="pt-4">
            <p className="text-[13px] font-bold text-[#0D1F1A] mb-2">Oldingi baholash bilan solishtirish</p>
            <div className="flex gap-6 items-end bg-[#F9FBFA] p-4 rounded-xl border border-[#E8EFED]">
               <div>
                  <p className="text-[11px] font-bold text-[#9DB4AB] uppercase">Oxirgi baho ({student.scores.tyutorBahosi.lastEvaluatedAt || 'Yo\'q'})</p>
                  <p className="text-lg font-black text-[#6B8A80]">{prevScore.toFixed(2)}/5</p>
               </div>
               <div>
                  <p className="text-[11px] font-bold text-[#9DB4AB] uppercase">Hozirgi baho</p>
                  <p className="text-lg font-black text-[#0D1F1A]">{totalScore.toFixed(2)}/5</p>
               </div>
               <div className="flex-1 text-right">
                  <p className="text-[11px] font-bold text-[#9DB4AB] uppercase">Farq</p>
                  {diff === 0 ? (
                    <p className="text-lg font-black text-[#6B8A80]">O'zgarmadi</p>
                  ) : diff > 0 ? (
                    <p className="text-lg font-black text-[#0A9B82]">+{diff.toFixed(2)} ↑</p>
                  ) : (
                    <p className="text-lg font-black text-[#DC2626]">{diff.toFixed(2)} ↓</p>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm space-y-8">
         <h3 className="text-lg font-bold text-[#0D1F1A] border-b border-[#E8EFED] pb-4">Mezonlar bo'yicha baholash</h3>
         
         {criteria.map(c => {
            const val = scores[c.id as keyof typeof scores];
            return (
              <div key={c.id} className="space-y-4 pb-8 border-b border-[#E8EFED] border-dashed last:border-0 last:pb-0">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                       <h4 className="text-[15px] font-bold text-[#0D1F1A]">{c.label}</h4>
                       <p className="text-[12px] text-[#6B8A80] mt-1">{c.desc}</p>
                    </div>
                    <span className="text-xl font-black text-[#0D1F1A]">
                       {val.toFixed(2)} <span className="text-sm text-[#9DB4AB]">/ 1</span>
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { l: 'Yomon', v: 0 },
                      { l: 'Qoniqarli', v: 0.5 },
                      { l: 'Yaxshi', v: 0.75 },
                      { l: 'A\'lo', v: 1.0 }
                    ].map(preset => (
                      <button
                        key={preset.l}
                        onClick={() => setScores({...scores, [c.id]: preset.v})}
                        className={cn(
                          "py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border",
                          val === preset.v ? "bg-[#0A9B82] text-white border-[#0A9B82]" : "bg-white text-[#6B8A80] border-[#E8EFED] hover:bg-slate-50"
                        )}
                      >
                        {preset.l} ({preset.v})
                      </button>
                    ))}
                 </div>

                 <input 
                    type="range" min="0" max="1" step="0.25" 
                    value={val} 
                    onChange={e => setScores({...scores, [c.id]: Number(e.target.value)})}
                    className="w-full h-2 bg-[#EDF7F4] rounded-lg appearance-none cursor-pointer accent-[#0A9B82]" 
                 />
                 
                 <div className="flex gap-2 items-center text-[#0A9B82] mt-2">
                   {[1,2,3,4,5].map(i => {
                     const fillValue = val * 5;
                     let isFilled = false;
                     if (fillValue >= i) isFilled = true;
                     return (
                       <div key={i} className={cn("w-2.5 h-2.5 rounded-full transition-all", isFilled ? "bg-[#0A9B82]" : "bg-[#E8EFED]" )} />
                     );
                   })}
                 </div>

                 <input 
                    type="text"
                    placeholder="Izoh (ixtiyoriy)..."
                    value={comments[c.id as keyof typeof comments]}
                    onChange={e => setComments({...comments, [c.id]: e.target.value})}
                    className="w-full bg-[#F9FBFA] border border-[#E8EFED] rounded-xl py-2 px-4 text-sm font-medium outline-none focus:border-[#0A9B82] mt-4"
                 />
              </div>
            )
         })}
      </div>

      <div className="bg-gradient-to-r from-[#F8FFFE] to-white rounded-[24px] border border-[#E8EFED] p-10 shadow-sm flex flex-col items-center text-center">
         <p className="text-[12px] font-black text-[#9DB4AB] uppercase tracking-widest mb-6">Jami Tyutor Bahosi</p>
         
         <div className="relative w-48 h-48 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#EDF7F4" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={getStrokeColor(totalScore)} strokeWidth="8" strokeDasharray={`${(totalScore / 5) * 283} 283`} className="transition-all duration-500 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: getStrokeColor(totalScore) }}>{totalScore.toFixed(2)}</span>
                <span className="text-sm font-bold text-[#9DB4AB] mt-1">/ 5 ball</span>
            </div>
         </div>

         <p className="mt-8 text-[15px] font-bold text-[#0D1F1A] bg-[#F9FBFA] px-6 py-3 rounded-xl border border-[#E8EFED]">
           {getLabelForScore(totalScore)}
         </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E8EFED] p-8 shadow-sm space-y-4">
         <label className="text-[13px] font-bold text-[#0D1F1A]">Umumiy izoh va tavsiyalar <span className="text-red-500">*</span></label>
         <textarea 
            value={generalFeedback}
            onChange={e => setGeneralFeedback(e.target.value)}
            className={cn(
               "w-full bg-[#F9FBFA] border rounded-xl py-4 px-4 text-[14px] font-medium outline-none min-h-[120px] resize-none transition-colors",
               generalFeedback.length > 0 && generalFeedback.length < 50 ? "border-amber-300 focus:border-amber-500" : "border-[#E8EFED] focus:border-[#0A9B82]"
            )}
            placeholder="Talaba haqida umumiy xulosa va uning rivojlanishi uchun tavsiyalar (kamida 50 ta belgi)..."
         />
         <div className="flex justify-between items-center text-[11px] font-bold">
            <span className={cn(generalFeedback.length < 50 ? "text-amber-500" : "text-[#0A9B82]")}>
               {generalFeedback.length} / 50 belgi
            </span>
         </div>
      </div>

      <div className="flex gap-4 pt-4">
         <button onClick={() => navigate(-1)} className="flex-1 py-4 border border-[#E8EFED] rounded-xl text-sm font-bold text-[#6B8A80] hover:bg-slate-50 transition-all">Bekor qilish</button>
         <button onClick={handleSaveAttempt} className="flex-1 py-4 bg-[#0A9B82] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0A9B82]/20 hover:bg-[#087D6A] transition-all flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Baholashni saqlash
         </button>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0D1F1A]/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
               <div className="p-6 border-b border-[#E8EFED]">
                 <h3 className="text-lg font-bold text-[#0D1F1A]">Baholashni tasdiqlash</h3>
               </div>
               <div className="p-6 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">Student</p>
                      <p className="text-[15px] font-bold text-[#0D1F1A] mt-1">{student.name}</p>
                      <p className="text-[12px] font-medium text-[#6B8A80] mt-0.5">Davr: {currentPeriod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider">Jami ball</p>
                      <p className="text-2xl font-black text-[#0A9B82] mt-1">{totalScore.toFixed(2)}/5</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#F8FFFE] rounded-xl border border-[#E8EFED] p-4 space-y-3">
                    <p className="text-[11px] font-black text-[#9DB4AB] uppercase tracking-wider mb-2">Mezonlar</p>
                    <div className="flex justify-between text-sm"><span className="font-medium text-[#374151]">Korporativ:</span> <span className="font-bold text-[#0D1F1A]">{scores.korporativ.toFixed(2)}/1</span></div>
                    <div className="flex justify-between text-sm"><span className="font-medium text-[#374151]">Ijtimoiy:</span> <span className="font-bold text-[#0D1F1A]">{scores.ijtimoiy.toFixed(2)}/1</span></div>
                    <div className="flex justify-between text-sm"><span className="font-medium text-[#374151]">Soft Skills:</span> <span className="font-bold text-[#0D1F1A]">{scores.softSkills.toFixed(2)}/1</span></div>
                    <div className="flex justify-between text-sm"><span className="font-medium text-[#374151]">Intizom:</span> <span className="font-bold text-[#0D1F1A]">{scores.intizom.toFixed(2)}/1</span></div>
                    <div className="flex justify-between text-sm"><span className="font-medium text-[#374151]">Yotoqxona:</span> <span className="font-bold text-[#0D1F1A]">{scores.yotoqxona.toFixed(2)}/1</span></div>
                  </div>
               </div>
               <div className="p-4 bg-gray-50 border-t border-[#E8EFED] flex gap-3">
                 <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 text-sm font-bold text-[#6B8A80] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E8EFED]">Bekor qilish</button>
                 <button onClick={confirmSave} className="flex-1 py-3 bg-[#0A9B82] text-white rounded-xl text-sm font-bold shadow-md shadow-[#0A9B82]/20 hover:bg-[#087D6A] transition-colors">Tasdiqlash va Saqlash ✓</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

