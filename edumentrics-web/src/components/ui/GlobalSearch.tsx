import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Eye, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const getAvatarGradient = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  if (firstLetter >= 'A' && firstLetter <= 'D') return 'linear-gradient(135deg,#0A9B82,#06D6A0)';
  if (firstLetter >= 'E' && firstLetter <= 'H') return 'linear-gradient(135deg,#2563EB,#60A5FA)';
  if (firstLetter >= 'I' && firstLetter <= 'L') return 'linear-gradient(135deg,#7C3AED,#A78BFA)';
  if (firstLetter >= 'M' && firstLetter <= 'P') return 'linear-gradient(135deg,#D97706,#FCD34D)';
  if (firstLetter >= 'Q' && firstLetter <= 'T') return 'linear-gradient(135deg,#DC2626,#F87171)';
  return 'linear-gradient(135deg,#0891B2,#67E8F9)';
};

const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} style={{ background: 'rgba(10,155,130,0.15)', color: '#0A9B82', borderRadius: '3px', padding: '0 2px' }}>{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function GlobalSearch() {
  const { students } = useAppContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const filtered = query.trim() === '' ? [] : students.filter(s => {
    const term = query.toLowerCase();
    const name = s.name || '';
    const studentId = s.studentId || '';
    const email = s.email || '';
    return (
      name.toLowerCase().includes(term) || 
      studentId.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term)
    );
  }).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
    if (e.key === 'Enter' && filtered.length > 0) {
      handleSelect(filtered[0].id);
    }
  };

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/superadmin/students/profile/${id}`);
  };

  return (
    <div className="relative w-full max-w-[420px] hidden md:block" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DB4AB]" />
        <input
          type="text"
          placeholder="Talabalarni qidiring..."
          value={query}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full bg-[#F4F7F6] border border-[#E8EFED] text-[#0D1F1A] placeholder:text-[#9DB4AB] text-sm rounded-xl pl-11 pr-10 py-2.5 focus:outline-none focus:border-[#0A9B82] focus:bg-white focus:ring-4 focus:ring-[#0A9B82]/5 transition-all"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DB4AB] hover:text-[#0D1F1A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-[calc(100%+8px)] left-0 w-[420px] max-h-[360px] overflow-y-auto bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[1000] p-1.5 custom-scrollbar"
          >
            {query.trim() === '' ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-[#F4F7F6] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-[#D1D5DB]" />
                </div>
                <p className="text-[13px] text-[#9DB4AB] font-medium text-center">Talaba ismi yoki ID bo'yicha qidiring</p>
              </div>
            ) : isLoading ? (
              <div className="p-2 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-gray-100 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-2 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-[11px] font-extrabold text-[#9DB4AB] uppercase tracking-[0.06em]">
                  O'quvchilar · {filtered.length} ta topildi
                </div>
                <ul className="space-y-0.5">
                  {filtered.map(s => (
                    <li key={s.id}>
                      <button
                        onClick={() => handleSelect(s.id)}
                        className="w-full text-left px-3 py-2.5 hover:bg-[#F8FFFE] rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-sm"
                            style={{ background: getAvatarGradient(s.name) }}
                          >
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#0D1F1A]">
                              <HighlightText text={s.name} highlight={query} />
                            </p>
                            <div className="text-[12px] text-[#9DB4AB] font-medium">
                              <HighlightText text={s.studentId || ''} highlight={query} /> · {s.year}-kurs, {s.group}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn(
                            "text-[14px] font-bold leading-none",
                            s.totalScore >= 85 ? "text-[#0A9B82]" : s.totalScore >= 75 ? "text-[#D97706]" : "text-[#DC2626]"
                          )}>{s.totalScore}</span>
                          {(s.riskStatus === 'At Risk' || s.riskStatus === 'Danger') && (
                            <div className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border leading-none",
                              s.riskStatus === 'At Risk' ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]" : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                            )}>
                              {s.riskStatus === 'Danger' ? 'Danger' : 'Risk'}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="relative">
                    <Search className="w-6 h-6 text-[#DC2626] opacity-30" />
                    <X className="w-4 h-4 text-[#DC2626] absolute -top-1 -right-1" />
                  </div>
                </div>
                <p className="text-[14px] font-semibold text-[#6B8A80]">"{query}" bo'yicha natija topilmadi</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
