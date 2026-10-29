"use client"
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RotateCw, ArrowUp, Calendar } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/reusable/dashboard/DataRangePiker';

export default function RevenueReportCard({ data = defaultData, onRefresh = () => { } }) {

    const [date, setDate] = useState<DateRange | undefined>(undefined);
    return (
        <div className="bg-white rounded-2xl p-3 border  w-full  ">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#0D0D12]  text-[18px] font-semibold leading-[150%]">Revenue Report</h3>
                <div className="flex items-center space-x-2">
                    <div className="">
                        <DateRangePicker required date={date} setDate={setDate} placeholder='Select date range' className='h-8 to w-full' />
                    </div>
                    <button
                        onClick={onRefresh}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Metric & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-baseline space-x-3">
                    <h4 className="text-[#0D0D12]  text-[24px] font-semibold leading-[130%] tracking-[0.12px]">${data.totalRevenue.toLocaleString()}</h4>
                    <div className="flex items-center text-primaryColor font-['Inter_Tight'] text-[14px] font-semibold leading-[150%] tracking-[0.28px]">
                        <ArrowUp className="w-3.5 h-3.5 mr-1" />
                        {data.growthRate}%
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-sm bg-amber-500" />
                        <span className="text-gray-600">This period</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-sm bg-teal-500" />
                        <span className="text-gray-600">Last period</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="currentPeriodGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                        <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tickFormatter={(val) => `$${val}K`} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-3 shadow-xl rounded-2xl border border-gray-100 text-sm w-48">
                                            <p className="font-bold text-gray-900 border-b pb-1.5 mb-2">Total Revenue</p>
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="text-gray-500">{payload[0].payload.dateStr}</span>
                                                <span className="font-bold text-amber-500">${payload[0].value}K</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500">{payload[1]?.payload?.comparisonDateStr}</span>
                                                <span className="font-bold text-teal-600">${payload[1]?.value}K</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area type="monotone" dataKey="currentPeriod" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#currentPeriodGrad)" />
                        <Area type="monotone" dataKey="lastPeriod" stroke="#00A8B5" strokeWidth={2.5} fill="none" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const defaultData = {
    totalRevenue: 60379.00,
    growthRate: 4.3,
    dateRange: 'Jun 25 - Jul 04, 2026',
    chartData: [
        { dateLabel: 'June 04, 2026', dateStr: 'June 08, 2026', comparisonDateStr: 'July 08, 2026', currentPeriod: 8.5, lastPeriod: 3.5 },
        { dateLabel: '', dateStr: 'June 10, 2026', comparisonDateStr: 'July 10, 2026', currentPeriod: 9.0, lastPeriod: 3.2 },
        { dateLabel: '', dateStr: 'June 12, 2026', comparisonDateStr: 'July 12, 2026', currentPeriod: 6.5, lastPeriod: 4.2 },
        { dateLabel: '', dateStr: 'June 14, 2026', comparisonDateStr: 'July 14, 2026', currentPeriod: 9.5, lastPeriod: 3.3 },
        { dateLabel: '', dateStr: 'June 16, 2026', comparisonDateStr: 'July 16, 2026', currentPeriod: 7.0, lastPeriod: 4.6 },
        { dateLabel: '', dateStr: 'June 18, 2026', comparisonDateStr: 'July 18, 2026', currentPeriod: 8.2, lastPeriod: 4.9 },
        { dateLabel: '', dateStr: 'June 20, 2026', comparisonDateStr: 'July 20, 2026', currentPeriod: 8.5, lastPeriod: 4.5 },
        { dateLabel: '', dateStr: 'June 22, 2026', comparisonDateStr: 'July 22, 2026', currentPeriod: 6.2, lastPeriod: 2.5 },
        { dateLabel: '', dateStr: 'June 24, 2026', comparisonDateStr: 'July 24, 2026', currentPeriod: 8.0, lastPeriod: 4.2 },
        { dateLabel: '', dateStr: 'June 26, 2026', comparisonDateStr: 'July 26, 2026', currentPeriod: 9.0, lastPeriod: 3.2 },
        { dateLabel: 'Jul 04, 2026', dateStr: 'July 04, 2026', comparisonDateStr: 'August 04, 2026', currentPeriod: 9.2, lastPeriod: 2.8 },
    ]
};