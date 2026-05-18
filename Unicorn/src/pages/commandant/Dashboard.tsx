import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Users, Building2, ShieldAlert, ShieldCheck, 
  History, ArrowRight, CalendarCheck, FileText, 
  CheckCircle2, Clock, MapPin 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { students, violations, absenceRequests, attendanceRecords, setIsActivitySidebarOpen } = useAppContext();
  const navigate = useNavigate();
  
  const dormStudents = students.filter(s => s.roomNumber);
  const roomsCount = new Set(dormStudents.map(s => s.roomNumber)).size;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentDormAlerts = violations.filter(v => 
    new Date(v.date) >= sevenDaysAgo
  );

  const pendingRequests = absenceRequests.filter(req => req.status === 'Pending').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => r.date === today && r.type === 'Evening');
  const markedToday = new Set(todayAttendance.map(r => r.studentId)).size;

  const KpiCard = ({ title, value, sub, icon: Icon, color, bgColor }: any) => (
    <div className="bg-white rounded-[14px] border border-[#E8EFED] p-[20px] px-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-wider">{title}</p>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", bgColor)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
      <div>
        <p className={cn("text-3xl font-black text-[#0D1F1A] tracking-tighter", title === 'Intizomiy holat' && value > 0 ? "text-[#FFB800]" : "")}>
          {value}
        </p>
        <p className="text-[12px] text-[#9DB4AB] font-medium mt-1">{sub}</p>
      </div>
    </div>
  );

  const events = [
    { type: 'attendance', student: 'Sardor Ergashev', desc: 'Kechki davomat belgilandi', time: 'Bugun', category: 'Davomat' },
    { type: 'request', student: 'Jasur Toshmatov', desc: 'Ruxsat so\'rovi: 16-17 may, 2 kun', time: '2 soat oldin', category: 'So\'rovlar' },
    { type: 'violation', student: 'Malika Yusupova', desc: 'Jiddiy qoidabuzarlik', time: 'Kecha', category: 'Qoidabuzarlik' },
    { type: 'late', student: 'Bobur Rahimov', desc: 'Kechqurun kechikib keldi', time: 'Kecha', category: 'Davomat' },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'violation': return { bg: 'bg-[#FEF2F2]', icon: ShieldAlert, color: 'text-[#DC2626]' };
      case 'late': return { bg: 'bg-[#FFFBEB]', icon: Clock, color: 'text-[#FFB800]' };
      case 'attendance': return { bg: 'bg-[#EDF7F4]', icon: CheckCircle2, color: 'text-[#0A9B82]' };
      case 'request': return { bg: 'bg-[#EFF6FF]', icon: FileText, color: 'text-[#2563EB]' };
      default: return { bg: 'bg-[#F3F4F6]', icon: History, color: 'text-[#9DB4AB]' };
    }
  };

  return (
    <div className="space-y-6 pb-14">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Komendant paneli</h1>
          <p className="text-[13px] text-[#6B8A80] font-medium mt-0.5">Yotoqxona nazorati va davomat boshqaruvi</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-[#9DB4AB] uppercase tracking-widest mb-0.5">Bugungi sana</p>
          <p className="text-[14px] font-bold text-[#0D1F1A]">
            {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Yotoqxonadagi talabalar" 
          value={dormStudents.length} 
          sub="Jami ro'yxatdagilar" 
          icon={Users} 
          color="text-[#0A9B82]" 
          bgColor="bg-[#EDF7F4]" 
        />
        <KpiCard 
          title="Band xonalar" 
          value={roomsCount} 
          sub="Yotoqxonadagi xonalar" 
          icon={Building2} 
          color="text-[#2563EB]" 
          bgColor="bg-[#EFF6FF]" 
        />
        <KpiCard 
          title="Intizomiy holat" 
          value={recentDormAlerts.length} 
          sub="Oxirgi 7 kundagi ogohlantirishlar" 
          icon={recentDormAlerts.length > 0 ? ShieldAlert : ShieldCheck} 
          color={recentDormAlerts.length > 0 ? "text-[#FFB800]" : "text-[#0A9B82]"} 
          bgColor={recentDormAlerts.length > 0 ? "bg-[#FFFBEB]" : "bg-[#EDF7F4]"} 
        />
        <KpiCard 
          title="Bugungi davomat" 
          value={`${markedToday}/${dormStudents.length}`} 
          sub={markedToday === dormStudents.length ? "Barcha belgilandi" : "Bugun belgilanmagan"} 
          icon={CalendarCheck} 
          color={markedToday === dormStudents.length ? "text-[#0A9B82]" : "text-[#7C3AED]"} 
          bgColor={markedToday === dormStudents.length ? "bg-[#EDF7F4]" : "bg-[#F5F3FF]"} 
        />
      </div>

      {/* Today's Attendance Summary Widget */}
      <div className="bg-white rounded-[14px] border border-[#E8EFED] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <h4 className="text-[14px] font-bold text-[#0D1F1A] mb-4">Bugungi yo'riqnoma holati (21:00)</h4>
          <div className="w-full">
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] font-bold">
                <span className="text-[#6B8A80]">Tungi tekshiruv (Kechki)</span>
                <span className={cn(markedToday === dormStudents.length ? "text-[#0A9B82]" : "text-[#FFB800]")}>
                  {markedToday}/{dormStudents.length} belgilandi
                </span>
              </div>
              <div className="h-2 w-full bg-[#F0F4F3] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0A9B82] transition-all duration-500" 
                  style={{ width: `${(markedToday / dormStudents.length) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/commandant/attendance')}
          className="h-12 px-6 bg-[#0A9B82] text-white rounded-xl text-[14px] font-bold flex items-center gap-3 hover:bg-[#087D6A] transition-all shadow-lg shadow-[#0A9B82]/20 shrink-0"
        >
          <CalendarCheck className="w-5 h-5" />
          Yo'riqnomani boshlash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => navigate('/commandant/attendance')}
            className="bg-white p-6 rounded-[14px] border border-[#E8EFED] hover:border-[#0A9B82]/30 transition-all cursor-pointer group shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#0A9B82]/5"
          >
            <div className="w-10 h-10 bg-[#EDF7F4] rounded-xl flex items-center justify-center text-[#0A9B82] mb-4 transition-transform group-hover:scale-110">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-[15px] font-bold text-[#0D1F1A] mb-1">Yo'riqnoma (Davomat)</h4>
            <p className="text-[13px] text-[#6B8A80] mb-4 leading-relaxed">Yuzma-yuz tekshiruvni boshlash</p>
            <div className="flex items-center text-[12px] font-bold text-[#0A9B82]">
              Yo'riqnomaga o'tish <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/commandant/violations')}
            className="bg-white p-6 rounded-[14px] border border-[#E8EFED] hover:border-[#FFB800]/30 transition-all cursor-pointer group shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#FFB800]/5"
          >
            <div className="w-10 h-10 bg-[#FFFBEB] rounded-xl flex items-center justify-center text-[#FFB800] mb-4 transition-transform group-hover:scale-110">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-[15px] font-bold text-[#0D1F1A] mb-1">Qoidabuzarlik bildirish</h4>
            <p className="text-[13px] text-[#6B8A80] mb-4 leading-relaxed">Intizomiy chora ko'rish</p>
            <div className="flex items-center text-[12px] font-bold text-[#FFB800]">
              Bildirgiga o'tish <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/commandant/absence-requests')}
            className="bg-white p-6 rounded-[14px] border border-[#E8EFED] hover:border-[#2563EB]/30 transition-all cursor-pointer group shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#2563EB]/5 relative"
          >
            {pendingRequests > 0 && (
              <div className="absolute top-4 right-4 bg-[#FFB800] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {pendingRequests} ta kutilmoqda
              </div>
            )}
            <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-4 transition-transform group-hover:scale-110">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-[15px] font-bold text-[#0D1F1A] mb-1">Ruxsat so'rovlari</h4>
            <p className="text-[13px] text-[#6B8A80] mb-4 leading-relaxed">Talabalar ruxsat so'rovlari</p>
            <div className="flex items-center text-[12px] font-bold text-[#2563EB]">
              So'rovlarga o'tish <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-[14px] border border-[#E8EFED] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-[#0D1F1A]">So'nggi hodisalar</h3>
            <button 
              onClick={() => setIsActivitySidebarOpen(true)}
              className="text-[12px] font-bold text-[#0A9B82] hover:underline"
            >
              Barchasini ko'rish
            </button>
          </div>
          <div className="space-y-4">
            {events.map((event, i) => {
              const style = getEventIcon(event.type);
              return (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-[#F8FFFE] transition-colors group">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", style.bg, style.color)}>
                    <style.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-[13px] font-bold text-[#0D1F1A] truncate">{event.student}</p>
                      <span className="text-[11px] font-medium text-[#9DB4AB] ml-2 shrink-0">{event.time}</span>
                    </div>
                    <p className="text-[12px] text-[#6B8A80] truncate mb-1.5">{event.desc}</p>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      style.bg, style.color
                    )}>
                      {event.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
