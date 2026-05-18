import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  description?: string;
  onClick?: () => void;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp = true, color = 'primary', description, onClick }: StatCardProps) {
  const colorMap = {
    primary: 'bg-[#EDF7F4] text-[#0A9B82] border-transparent',
    secondary: 'bg-[#EFF6FF] text-[#2563EB] border-transparent',
    success: 'bg-[#EDF7F4] text-[#0A9B82] border-transparent',
    warning: 'bg-[#FFFBEB] text-[#D97706] border-transparent',
    danger: 'bg-[#FEF2F2] text-[#DC2626] border-transparent',
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white p-5 rounded-[14px] flex flex-col justify-between border border-[#E8EFED] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md h-full",
        onClick ? "cursor-pointer" : ""
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-[#9DB4AB] text-[11px] font-medium uppercase tracking-[0.07em]">{title}</p>
        <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center border transition-transform duration-300 group-hover:scale-105", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div>
        <h3 className="text-[32px] font-extrabold tracking-[-1px] text-[#0D1F1A] leading-none mb-1">{value}</h3>
        {description && (
          <p className="text-[12px] text-[#9DB4AB]">
            {description}
          </p>
        )}
      </div>
      
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
          <span className={cn(
            trendUp ? "text-[#0A9B82]" : "text-[#DC2626]"
          )}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-[#9DB4AB] font-medium tracking-tight">o'tgan oyga nisbatan</span>
        </div>
      )}
    </div>
  );
}
