"use client";

import React, { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface GraphSeriesItem {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
}

export interface CommonAnalyticsGraphProps {
  data: any[];
  series: GraphSeriesItem[];
  subtitle?: string;
  height?: string;
  className?: string;
}

export default function CommonAnalyticsGraph({
  data = [],
  series = [],
  subtitle,
  height = "h-72 sm:h-80",
  className = "",
}: CommonAnalyticsGraphProps) {
  // Max value and ticks calculation matching AnalyticsAdvertisementPage
  const { maxChartVal, yTicks } = useMemo(() => {
    let max = 0;
    (data || []).forEach((row: any) => {
      series.forEach((s) => {
        const val = Number(row?.[s.dataKey] || 0);
        if (val > max) max = val;
      });
    });

    if (max === 0) {
      return {
        maxChartVal: 100,
        yTicks: [0, 20, 40, 60, 80, 100],
      };
    }

    if (max <= 10) {
      return {
        maxChartVal: 12,
        yTicks: [0, 3, 6, 9, 12],
      };
    }

    if (max <= 100) {
      return {
        maxChartVal: 100,
        yTicks: [0, 20, 40, 60, 80, 100],
      };
    }

    const roundedMax = Math.ceil(max * 1.25);
    return {
      maxChartVal: roundedMax,
      yTicks: [
        0,
        Math.round(roundedMax * 0.2),
        Math.round(roundedMax * 0.4),
        Math.round(roundedMax * 0.6),
        Math.round(roundedMax * 0.8),
        roundedMax,
      ],
    };
  }, [data, series]);

  // Format Y-axis tick values (e.g. 1000 -> 1k, 50000 -> 50k)
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      const k = val / 1000;
      return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
    }
    return val.toString();
  };

  // Custom Tooltip matching design exactly
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white rounded-xl shadow-xl border border-borderColor/80 p-3.5 min-w-44 text-xs">
        <p className="font-bold text-headerColor text-xs pb-1.5 mb-2 border-b border-borderColor/60">
          {subtitle || `${label || ""} Insights`}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const seriesConfig = series.find(
              (s) => s.dataKey === entry.dataKey,
            );
            const color = seriesConfig?.color || entry.color;
            const name = seriesConfig?.name || entry.name;
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-descriptionColor"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600 font-medium">{name}</span>
                </span>
                <span className="font-bold text-headerColor">
                  {entry.dataKey === "ctr" ? `${Number(entry.value ?? 0).toLocaleString()}%` : Number(entry.value ?? 0).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full mt-6 ${height} ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#F3F4F6"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, maxChartVal]}
            ticks={yTicks}
            tickFormatter={formatYAxis}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip
            cursor={{
              stroke: "#F3F4F6",
              strokeWidth: 5,
              strokeLinecap: "round",
            }}
            content={<CustomTooltip />}
          />
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2.5}
              dot={false}
              activeDot={{
                r: 5,
                stroke: s.color,
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
