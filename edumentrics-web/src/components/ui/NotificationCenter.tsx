import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const mockNotifications = [
  { id: '1', title: 'Nilufar K. score dropped to 70 — DANGER', time: '10 mins ago', type: 'danger', read: false },
  { id: '2', title: 'Malika Y. is at risk of losing Unicorn grant', time: '2 hours ago', type: 'warning', read: false },
  { id: '3', title: 'Sardor E. certificate approved by Admin', time: 'Today, 09:15', type: 'success', read: true },
  { id: '4', title: 'LMS sync completed — 45 records updated', time: 'Yesterday', type: 'primary', read: true },
  { id: '5', title: 'New absence request from Bobur R.', time: 'Yesterday', type: 'neutral', read: true },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setIsActivitySidebarOpen } = useAppContext();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger': return <ShieldAlert className="w-4 h-4 text-danger" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'primary': return <RefreshCw className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF4C6A] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white ring-1 ring-rose-500/20">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[85vh]"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md shrink-0">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                Bildirishnomalar
                {unreadCount > 0 && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full">{unreadCount} Yangi</span>}
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors font-semibold"
                >
                  <Check className="w-3 h-3" /> Hammasini o'qildi
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="space-y-1">
                {notifications.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 text-sm">
                    Yangi bildirishnomalar yo'q
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-3 rounded-xl flex gap-3 items-start transition-colors cursor-pointer group",
                        n.read ? "hover:bg-slate-50" : "bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full mt-0.5 border shadow-sm shrink-0",
                        n.type === 'danger' ? "bg-rose-50 border-rose-100" :
                        n.type === 'warning' ? "bg-amber-50 border-amber-100" :
                        n.type === 'success' ? "bg-emerald-50 border-emerald-100" : 
                        n.type === 'primary' ? "bg-sky-50 border-sky-100" : "bg-slate-50 border-slate-100"
                      )}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 pr-2">
                        <p className={cn("text-sm mb-1 leading-snug", n.read ? "text-slate-600" : "text-slate-900 font-bold")}>
                          {n.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{n.time}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 border border-white" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md shrink-0">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsActivitySidebarOpen(true);
                }}
                className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all shadow-sm"
              >
                Hammasini ko'rish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
