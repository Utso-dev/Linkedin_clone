"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard from "@/components/reusable/CommonStateCard";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { useGetJobOverviewQuery } from "@/feature/slice/jobs/analyticSlice";
import {
  ActiveIcon,
  ApplicantIcon,
  OpenEyeIcon,
} from "@/public/svgIcons/Icons";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GraphPoint {
  label: string;
  total_applicants: number;
  job_views: number;
  active_positions: number;
}

const SERIES_META: Record<string, { color: string; label: string }> = {
  total_applicants: { color: "#10B981", label: "Total Applicant" },
  job_views: { color: "#F59E0B", label: "Job Views" },
  active_positions: { color: "#EF4444", label: "Active Positions" },
};

const RANGE_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AnalyticsPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetJobOverviewQuery({});

  const overviewData = response?.data;
  const cards = overviewData?.cards;
  const graph = overviewData?.graph;

  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");

  // Sync default range if specified by graph
  useEffect(() => {
    if (graph?.active === "weekly" || graph?.active === "monthly") {
      setActiveRange(graph.active);
    }
  }, [graph?.active]);

  // Direct array from graph response (no complex matrix transformations needed)
  const chartData: GraphPoint[] = (graph?.[activeRange] || []) as GraphPoint[];

  // Max value calculation for Y-axis
  const maxChartVal = useMemo(() => {
    let max = 0;
    chartData.forEach((row) => {
      max = Math.max(
        max,
        Number(row.total_applicants) || 0,
        Number(row.job_views) || 0,
        Number(row.active_positions) || 0,
      );
    });
    if (max === 0) return 40;
    if (max <= 10) return 12;
    return Math.ceil(max * 1.25);
  }, [chartData]);

  // Y-axis tick formatter (e.g., 30k, 40k or raw numbers)
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k`;
    }
    return val.toString();
  };

  // Card metric items configuration
  const cardItems = [
    {
      id: "job_views",
      title: "Job Views",
      total: cards?.job_views?.total ?? 0,
      growthPercentage: cards?.job_views?.growth_percentage,
      badgeText: cards?.job_views?.growth
        ? cards.job_views.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.job_views?.is_positive ?? true,
      growthText: "From last month",
      icon: OpenEyeIcon,
    },
    {
      id: "total_applicants",
      title: "Total Applicant",
      total: cards?.total_applicants?.total ?? 0,
      growthPercentage: cards?.total_applicants?.growth_percentage,
      badgeText: cards?.total_applicants?.growth
        ? cards.total_applicants.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.total_applicants?.is_positive ?? true,
      growthText: "From last month",
      icon: ApplicantIcon,
    },
    {
      id: "active_positions",
      title: "Active Positions",
      total: cards?.active_positions?.total ?? 0,
      growthPercentage: cards?.active_positions?.growth_percentage,
      badgeText: cards?.active_positions?.growth
        ? cards.active_positions.growth.split(" ")[0]
        : undefined,
      isPositive: cards?.active_positions?.is_positive ?? true,
      growthText: "From last month",
      icon: ActiveIcon,
    },
  ];

  // Custom Tooltip matching design
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white rounded-xl shadow-xl border border-borderColor/80 p-3.5 min-w-42.5 text-xs">
        <p className="font-bold text-headerColor text-xs pb-1.5 mb-2 border-b border-borderColor/60">
          {graph?.subtitle || "Applications Over Time"}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const meta = SERIES_META[entry.dataKey] || {
              color: entry.color,
              label: entry.name,
            };
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-descriptionColor"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color || meta.color }}
                  />
                  <span className="text-gray-600 font-medium">
                    {meta.label}
                  </span>
                </span>
                <span className="font-bold text-headerColor">
                  {Number(entry.value).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <StateCardSkleton />
        <GraphSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-borderColor/80 p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold text-sm">
          Failed to load job overview analytics.
        </p>
        <button
          onClick={() => refetch()}
          className="text-xs bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cardItems.map((item) => (
          <CommonStateCard
            key={item.id}
            title={item.title}
            total={item.total}
            growthPercentage={item.growthPercentage}
            badgeText={item.badgeText}
            isPositive={item.isPositive}
            growthText={item.growthText}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Jobs Overview Graph Card */}
      <div className="bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs">
        {/* Graph Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-headerColor">
              {graph?.title || "Jobs Overview Graph"}
            </h2>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 text-xs font-medium text-grayColor1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>Total Applicant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>Job Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span>Active Positions</span>
              </div>
            </div>
          </div>

          {/* Range Dropdown Filter using SelecteInputField */}
          <div className="w-32 self-start sm:self-auto">
            <SelecteInputField
              value={activeRange}
              onChange={(val) => setActiveRange(val as "weekly" | "monthly")}
              options={RANGE_OPTIONS}
              className="h-9 text-xs font-medium rounded-sm border-borderColor bg-white"
            />
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-72 sm:h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
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
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, maxChartVal]}
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
              <Line
                type="monotone"
                dataKey="total_applicants"
                name="Total Applicant"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#10B981",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey="job_views"
                name="Job Views"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#F59E0B",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey="active_positions"
                name="Active Positions"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#EF4444",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
