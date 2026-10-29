"use client";

import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { Calendar, RotateCw, UserPlus, Megaphone, CreditCard, User, FileText } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const activities = [
    {
        icon: UserPlus,
        title: "User Registered",
        desc: "John Smith joined as Psychologist",
        time: "10:34 PM",
    },
    {
        icon: Megaphone,
        title: "Advertisement Submitted",
        desc: "Neuro Assessment Toolkit submitted for approval",
        time: "10:32 PM",
    },
    {
        icon: CreditCard,
        title: "Subscription Purchased",
        desc: "Dr. Emay Oavts purchased Industry Plan",
        time: "10:30 PM",
    },
    {
        icon: User,
        title: "Profile Updated",
        desc: "Anna Lee updated her professional credentials",
        time: "10:28 PM",
    },
    {
        icon: FileText,
        title: "Report Generated",
        desc: "Weekly usage report generated for Dr. Emay Oavts",
        time: "10:20 PM",
    },
];

export default function RecentlyActivity() {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 ">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-[17px] font-semibold text-gray-900">
                    Recent Activities
                </h3>

                <div className="flex items-center gap-2">
                    {/* Date Range */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white">

                        <DateRangePicker
                            date={date}
                            setDate={setDate}
                            placeholder="Select date range"
                            className="w-auto h-auto px-0 py-0 border-none bg-transparent text-sm font-normal text-gray-600"
                        />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => { }}
                        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Activity List */}
            <div className="divide-y divide-gray-100">
                {activities.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="flex items-center gap-4 px-5 py-2 hover:bg-gray-50 transition-colors"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
                                <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                            </div>

                            {/* Title + Description */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {item.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Time */}
                            <div className="flex-shrink-0 text-sm text-gray-400">
                                {item.time}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}