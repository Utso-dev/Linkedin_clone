import React from 'react';

const EmploymentLoading = () => {
  // Creating an array of 3 to represent the cards in each column
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="h-9 w-64 bg-slate-200 rounded-lg mb-8" />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100" />

        {/* Column 1: State and Institution */}
        <div className="space-y-6">
          <div className="h-10 w-full bg-slate-100 rounded-md mb-4 flex items-center px-4">
             <div className="h-4 w-40 bg-slate-200 rounded" />
          </div>
          
          {skeletonCards.map((_, i) => (
            <div key={`col1-${i}`} className="border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded" /> {/* Company */}
                  <div className="h-4 w-24 bg-slate-100 rounded" /> {/* Location */}
                </div>
                <div className="h-3 w-16 bg-slate-100 rounded" /> {/* Time */}
              </div>
              <div className="h-6 w-48 bg-slate-200 rounded" /> {/* Job Title */}
              <div className="flex justify-between items-end pt-2">
                <div className="flex gap-2">
                  <div className="h-7 w-16 bg-slate-100 rounded-full" /> {/* Badge 1 */}
                  <div className="h-7 w-16 bg-slate-100 rounded-full" /> {/* Badge 2 */}
                  <div className="h-7 w-20 bg-slate-100 rounded-full" /> {/* Salary */}
                </div>
                <div className="h-9 w-20 bg-slate-50 rounded-lg border border-slate-100" /> {/* View Button */}
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Private Practice */}
        <div className="space-y-6">
          <div className="h-10 w-full bg-slate-100 rounded-md mb-4 flex items-center px-4">
             <div className="h-4 w-40 bg-slate-200 rounded" />
          </div>

          {skeletonCards.map((_, i) => (
            <div key={`col2-${i}`} className="border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-48 bg-slate-200 rounded" />
              <div className="flex justify-between items-end pt-2">
                <div className="flex gap-2">
                  <div className="h-7 w-16 bg-slate-100 rounded-full" />
                  <div className="h-7 w-16 bg-slate-100 rounded-full" />
                  <div className="h-7 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="h-9 w-20 bg-slate-50 rounded-lg border border-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmploymentLoading;