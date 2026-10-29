"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { RotateCw } from "lucide-react";

const COLORS = ["#14B8A6", "#FACC15", "#F87171", "#E5E7EB"]; // Teal, Yellow, Red, Gray

export default function AdPerformanceOverview({
    data = defaultData,
    onRefresh = () => { },
}) {
    return (
        <div className="bg-white rounded-2xl p-3  border border-[#E5E5E5] w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#000]  text-[18px] font-semibold leading-[150%]">
                    Ad Performance Overview
                </h3>
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
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
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
                                    fontSize: "13px",
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
                    <div
                        key={item.name}
                        className="flex items-center justify-between w-full text-sm"
                    >
                        <div className="flex items-center space-x-3">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-[#121212]  text-xs not-italic font-semibold leading-[15.84px] tracking-[0.06px]">
                                {item.name}
                            </span>
                        </div>

                        <span className="w-16 text-[#121212]  text-xs not-italic font-normal leading-[15.84px] tracking-[0.06px]">
                            {item.percentage}%
                        </span>
                        <span className="w-10 text-[#121212]  text-xs not-italic font-normal leading-[132%] tracking-[0.06px] text-right">
                            {item.count}
                        </span>
                    </div>

                ))}
            </div>
        </div>
    );
}

// Default Data matching the image
const defaultData = {
    total: 24580,
    items: [
        { name: "Active", percentage: 55.55, count: 143, value: 143 },
        { name: "Pending", percentage: 7.0, count: 18, value: 18 },
        { name: "Cancel", percentage: 4.7, count: 12, value: 12 },
        { name: "Expired", percentage: 12.5, count: 32, value: 32 },
    ],
};