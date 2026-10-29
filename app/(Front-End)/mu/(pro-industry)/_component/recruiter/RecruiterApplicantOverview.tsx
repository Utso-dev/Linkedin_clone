"use client";

import { MultiUserIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GraphPoint {
  label: string;
  total_applicants?: number;
  job_views?: number;
  active_positions?: number;
}

interface ApplicantsChartData {
  active?: string;
  weekly?: GraphPoint[];
  monthly?: GraphPoint[];
}

interface ActivityFeedItem {
  id: string | number;
  type?: string;
  title?: string;
  message?: string;
  time?: string;
  created_at_human?: string;
  is_read?: boolean;
}

interface RecruiterApplicantOverviewProps {
  applicantsChart?: ApplicantsChartData;
  activityFeed?: ActivityFeedItem[];
}

function RecruiterApplicantOverview({
  applicantsChart,
  activityFeed = [],
}: RecruiterApplicantOverviewProps) {
  const [chartRange, setChartRange] = useState<"weekly" | "monthly" >(
    "weekly",
  );

  useEffect(() => {
    if (
      applicantsChart?.active === "weekly" ||
      applicantsChart?.active === "monthly"
      
    ) {
      setChartRange(applicantsChart.active);
    }
  }, [applicantsChart?.active]);

  const chartData = useMemo(() => {
    const rangeData = applicantsChart?.[chartRange] || [];

    return rangeData.map((item) => ({
      name: item.label,
      applicants: item.total_applicants ?? 0,
    }));
  }, [applicantsChart, chartRange]);

  // Max value for Y-axis domain
  const chartMaxVal = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.applicants), 4);
    return Math.ceil(maxVal * 1.2);
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Applicants Chart */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-borderColor/80 p-5 flex flex-col justify-between">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base  font-semibold text-headerColor">
              Applicants Added
            </h3>
          </div>

          {/* Range Toggle Tabs */}
          <div className="bg-bgLightColor border border-bgColor rounded-md p-0.75 flex items-center gap-1 self-start sm:self-auto">
            {(["weekly", "monthly"] as const).map((range) => {
              const isActive = chartRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setChartRange(range)}
                  className={`px-3.5 py-1 rounded-md text-sm font-semibold capitalize transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-headerColor shadow-xs "
                      : "text-grayColor1 hover:text-headerColor"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-68 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="applicantsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#009DA0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#009DA0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#F3F4F6"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, chartMaxVal]}
                allowDecimals={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-blackColor text-white px-3.5 py-2 rounded-md shadow-xl text-xs font-medium space-y-0.5">
                        <p className="font-bold text-sm flex items-center gap-1">
                          <MultiUserIcon className="w-4 h-4" />{" "}
                          {payload[0].value} 
                        </p>
                        <p className="text-gray-300 text-[11px] flex items-center gap-1">
                        Applicant
                          {Number(payload[0].value) !== 1 ? "s" : ""}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="applicants"
                stroke="#009DA0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#applicantsGradient)"
                dot={{
                  r: 3,
                  fill: "#009DA0",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#009DA0",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-borderColor/80 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-headerColor">
              Activity Feed
            </h3>
            <Link
              href="/mu/recruiter-dashboard/activity-feed"
              className="text-sm font-medium text-grayColor1 hover:text-primaryColor transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="  ">
            {activityFeed.length > 0 ? (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="pt-3.5 first:pt-0 border-b pb-4 flex items-start gap-3"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-buttonColor shrink-0 mt-1.5 shadow-xs" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-headerColor truncate">
                        {item.title}
                      </h4>
                      <span className="text-sm text-grayColor1 shrink-0">
                        {item.time || item.created_at_human}
                      </span>
                    </div>
                    <p className="text-sm text-grayColor1 mt-0.5 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-grayColor1">
                No recent activities recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterApplicantOverview;
