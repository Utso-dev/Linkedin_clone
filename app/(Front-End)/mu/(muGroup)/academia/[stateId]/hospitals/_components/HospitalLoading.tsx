import React from 'react';

const HospitalLoading = () => {
  const rows = Array.from({ length: 10 });
  return (
    <div className="w-full overflow-hidden animate-pulse">


      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="bg-[#F1F5F9] h-12 flex items-center px-6 gap-4 border-b border-slate-100">
          <div className="w-8 h-4 bg-slate-300 rounded" />
          <div className="w-32 h-4 bg-slate-300 rounded" />
          <div className="ml-auto w-32 h-4 bg-slate-300 rounded text-right" />
        </div>

        <div className="divide-y divide-slate-50">
          {rows.map((_, index) => (
            <div
              key={index}
              className={`flex items-center px-6 py-4 gap-4 ${index % 2 === 1 ? 'bg-[#F8FAFC]/60' : 'bg-white'}`}
            >
              <div className="w-8 h-4 bg-slate-200 rounded" />
              <div className="w-1/3 h-4 bg-slate-200 rounded-md" />
              <div className="ml-auto w-1/4 h-4 bg-slate-100 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalLoading;