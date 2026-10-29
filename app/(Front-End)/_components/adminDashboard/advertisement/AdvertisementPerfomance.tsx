"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    {
        name: "Clinical\nPsychologist",
        Impression: 950,
        Click: 475,
    },
    {
        name: "Research\nAssistant",
        Impression: 792,
        Click: 480,
    },
    {
        name: "Professor",
        Impression: 490,
        Click: 100,
    },
    {
        name: "Neuro-\nscientist",
        Impression: 810,
        Click: 512,
    },
    {
        name: "Researcher",
        Impression: 485,
        Click: 110,
    },
    {
        name: "Lab\nTechnician",
        Impression: 320,
        Click: 80,
    },
    {
        name: "Product\nManager",
        Impression: 520,
        Click: 245,
    },
];

export default function AdvertisementPerformance() {

    const stats = [
        {
            title: "Total Advertisements",
            value: "16",
        },
        {
            title: "Total Views",
            value: "484,456",
        },
        {
            title: "Total Clicks",
            value: "145,567",
        },
        {
            title: "CTR",
            value: "26.5%",
        },
    ];
    return (
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 ">
            {/* Title */}
            <h3 className="mb-2 text-[#000]  text-[18px] font-semibold leading-[150%]">
                Advertisement Performance
            </h3>

            {/* Stats Cards */}
            <div className="mb-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
                    >
                        <p className="text-[#777980]  text-xs not-italic font-normal leading-[15.84px] tracking-[0.06px]">
                            {item.title}
                        </p>

                        <p className="mt-1 text-headerColor  text-[24px] not-italic font-semibold leading-[31.2px] tracking-[0.12px]">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chart Title + Legend */}
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[#777980]  text-sm not-italic font-semibold leading-[19.6px] tracking-[0.07px]">Views vs Click</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]"></span>
                        <span className="text-[#6C7278]">Impression</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#2DD4BF]"></span>
                        <span className="text-[#6C7278]">Click</span>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                        barGap={8}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f0f0f0"
                        />
                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: 12,
                                fill: "#ACB5BB",
                                fontFamily: "Segoe UI",
                                fontWeight: 400,
                                textAnchor: "middle",
                            }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "#ACB5BB" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Bar
                            dataKey="Impression"
                            fill="#04A1B7"
                            radius={[4, 4, 0, 0]}
                            barSize={28}
                        />
                        <Bar
                            dataKey="Click"
                            fill="#07C3BB"
                            radius={[4, 4, 0, 0]}
                            barSize={28}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}