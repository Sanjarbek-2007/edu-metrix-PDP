import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import StudentTable from '../../components/ui/StudentTable';

export default function Students() {
  const { students } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialFilter = searchParams.get('filter') || undefined;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E8EFED]">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D1F1A] tracking-[-0.3px]">Talabalar ro'yxati</h1>
          <p className="text-[13px] text-[#6B8A80] mt-1 font-medium">Barcha kurslar va guruhlar bo'yicha talabalar monitoringi</p>
        </div>
      </div>

      <div className="min-h-[600px] h-fit">
        <StudentTable 
          students={students} 
          onRowClick={(id) => navigate(`/admin/students/profile/${id}`)}
          initialFilter={initialFilter}
        />
      </div>
    </div>
  );
}
