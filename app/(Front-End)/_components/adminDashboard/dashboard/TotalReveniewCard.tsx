"use client"
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { RotateCw } from 'lucide-react';

const COLORS = ['#00A8B5', '#00B8D9', '#FF9F0A']; // Teal, Cyan, Orange

export default function TotalRevenuePieCard({ data = defaultData, onRefresh }) {
    return (
        <div className="bg-white rounded-2xl p-3  border  w-full h-full ">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#0D0D12] font-['Segoe_UI'] text-[18px] font-semibold leading-[150%]">Total Revenue</h3>
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>

            {/* Donut Chart with Center Text */}
            <div className="relative h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.items}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.items.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}

                            {/* Center Labels */}
                            <Label
                                value="Total Revenue"
                                position="center"
                                dy={-12}
                                style={{
                                    fontSize: "12px",
                                    fill: "#9CA3AF",
                                    fontWeight: 500,
                                }}
                            />
                            <Label
                                value={`$${data.total.toLocaleString()}`}
                                position="center"
                                dy={12}
                                style={{
                                    fontSize: "24px",
                                    fill: "#0D0D12",
                                    fontWeight: 600,
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend / Breakdown List */}
            <div className="mt-4 space-y-3">
                {data.items.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-[#121212] font-['Segoe_UI'] text-xs font-semibold leading-[132%] tracking-[0.06px]">{item.name}</span>
                        </div>
                        <div className="flex space-x-6 text-gray-600">
                            <span className="w-16 text-[#121212] font-['Segoe_UI'] text-xs font-semibold leading-[132%] tracking-[0.06px]">{item.percentage}%</span>
                            <span className="w-20 text-[#121212] font-['Segoe_UI'] text-xs font-semibold leading-[132%] tracking-[0.06px]">${item.amount.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Default Data for preview/API fallback
// Updated Default Data with 'value' property for Recharts Pie
const defaultData = {
    total: 48789,
    items: [
        { name: 'Subscriptions', percentage: 39.98, amount: 32455, value: 32455 },
        { name: 'Advertisements', percentage: 24.67, amount: 13200, value: 13200 },
        { name: 'Sponsors', percentage: 14.76, amount: 7634, value: 7634 },
    ]
};