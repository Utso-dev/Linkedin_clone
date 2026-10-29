"use client"

import React from 'react';

const GoogleMapLoading = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-pulse">
      {/* Map Container */}
      <div className="relative w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Google My Maps Header Placeholder */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-slate-800 flex items-center px-4 justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full" /> {/* Avatar icon */}
            <div className="space-y-2">
              <div className="h-4 w-48 bg-slate-600 rounded" /> {/* Map Title */}
              <div className="h-3 w-24 bg-slate-700 rounded" /> {/* Author Name */}
            </div>
          </div>
          <div className="flex gap-4">
             <div className="w-6 h-6 bg-slate-700 rounded" /> {/* Share icon */}
             <div className="w-6 h-6 bg-slate-700 rounded" /> {/* Expand icon */}
          </div>
        </div>

        {/* Map Background & Shimmer */}
        <div className="absolute inset-0 bg-[#DEE1E6]">
            <div className="flex items-center justify-center h-full pt-14">
                <svg 
                    viewBox="0 0 100 150" 
                    className="w-1/3 h-auto fill-slate-300 opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* <path d="M20,10 L80,5 L85,110 L70,140 L25,145 L15,110 Z" /> */}
                    <circle cx="50" cy="40" r="4" className="fill-slate-400" />
                    <circle cx="40" cy="60" r="4" className="fill-slate-400" />
                    <circle cx="65" cy="85" r="4" className="fill-slate-400" />
                    <circle cx="35" cy="125" r="4" className="fill-slate-400" />
                </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        {/* Zoom Controls Placeholder (Bottom Left) */}
        <div className="absolute bottom-6 left-6 space-y-1 z-10">
          <div className="w-10 h-10 bg-white rounded-t-md shadow-sm border border-slate-200" />
          <div className="w-10 h-10 bg-white rounded-b-md shadow-sm border border-slate-200" />
        </div>

        {/* Google Logo Placeholder (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-300/40 rounded z-10" />
      </div>
    </div>
  );
};

export default GoogleMapLoading;