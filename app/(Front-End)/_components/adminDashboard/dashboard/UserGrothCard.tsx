"use client"
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RotateCw, ArrowUp } from 'lucide-react';

export default function UserGrowthCard({ data = defaultData, onRefresh = () => { } }) {
    return (
        <div className="bg-white rounded-2xl p-3  border  w-full  h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-[#0D0D12]  text-[18px] font-semibold leading-[150%]">User Growth</h3>
                    <p className="text-[#6C6C6D]  text-[16px] font-normal leading-[150%] tracking-[0.08px] mt-0.5">Total users</p>
                </div>
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>

            {/* Metric & Growth Badge */}
            <div className="flex items-baseline justify-between mb-4">
                <h4 className="text-[#0D0D12]  text-[24px] font-semibold leading-[130%] tracking-[0.12px]">{data.totalUsers.toLocaleString()} users</h4>
                <div className="flex items-center text-primaryColor font-['Inter_Tight'] text-[14px] font-semibold leading-[150%] tracking-[0.28px]">
                    <ArrowUp className="w-3.5 h-3.5 mr-1" />
                    {data.growthRate}%
                </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00A8B5" stopOpacity={0.25} /> 
                                <stop offset="95%" stopColor="#00A8B5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} tickFormatter={(val) => `${val}K`} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white px-3 py-1.5 shadow-lg rounded-xl border border-gray-100 text-sm font-semibold text-gray-900">
                                            {payload[0].value.toLocaleString()}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />  
                        <Area type="monotone" dataKey="users" stroke="#00A8B5" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrowthGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const defaultData = {
    totalUsers: 112420,
    growthRate: 2.9,
    chartData: [
        { month: 'Jan', users: 8.2 },
        { month: 'Feb', users: 9.1 },
        { month: 'Mar', users: 6.8 },
        { month: 'Apr', users: 11.5 },
        { month: 'May', users: 8.8 },
        { month: 'Jun', users: 10.4 },
    ]
};