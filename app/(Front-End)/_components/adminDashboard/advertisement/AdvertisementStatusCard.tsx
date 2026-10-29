"use client"
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { ArrowDownToLine, Plus } from "lucide-react";

export default function AdvertisementStatusCard() {
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const CardData = [
        {
            title: "Total Advertisements",
            value: "427",
            icon: IoIosTrendingUp,
            percentage: "59.2%",
        },
        {
            title: "Active Advertisements",
            value: "323",
            icon: IoIosTrendingUp,
            percentage: "59.2%",
        },
        {
            title: "Pending Approval",
            value: "35",
            icon: IoIosTrendingUp,
            percentage: "2.8%",
        },
        {
            title: "Total Ad Revenue",
            value: "24,580",
            icon: IoIosTrendingDown,
            percentage: "12.2%",
        },


    ];

    return (
        <div>

            <div className="flex flex-col justify-between gap-4 lg:flex-row " >
                <div>
                    <CustomTitleDescription
                        title="Advertise Management Dashboard"
                        description="Welcome back, Vin! Here's what's happening on Mind Unite today."
                    />
                </div>
                <div className="flex gap-2.5">
                    
                    <button className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto">
                        <ArrowDownToLine className="h-4 w-4" />
                        Export
                    </button>
                    <div className="h-10 w-full">
                        <DateRangePicker date={date} setDate={setDate} placeholder='Select date range' className='h-10 w-full cursor-pointer' />
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
                {CardData.map((item, index) => {
                    const Icon = item.icon;

                    const isDown = item.icon === IoIosTrendingDown;

                    return (
                        <div
                            key={index}
                            className="rounded-lg bg-white p-4 border"
                        >
                            <div className=" flex items-center justify-between">
                                <h3 className="text-[#777980]  text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
                                    {item.title}
                                </h3>
                                <div>
                                    <IoArrowForward className="text-[#777980]" />
                                </div>


                            </div>
                            <p className="text-headerColor  text-[32px] font-semibold leading-[130%] py-3">
                                {item.value}
                            </p>

                            <div className="flex gap-2.5 ">
                                <div className={`flex items-center gap-1 rounded-full ${isDown ? "bg-[#FEECEE]" : "bg-[#E9FAF7]"}  p-1`}>
                                    <Icon
                                        size={20}
                                        className={
                                            isDown
                                                ? "text-[#EB3D4D] rotate-120 "
                                                : "text-primaryColor "
                                        }
                                    />

                                    <span
                                        className={
                                            isDown
                                                ? "text-[#EB3D4D]  text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                                : "text-primaryColor  text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                        }
                                    >
                                        {item.percentage}
                                    </span>
                                </div>

                                <p className="text-[#777980]  text-[12px] font-normal leading-[132%] tracking-[0.06px] flex justify-center items-center">
                                    VS previous month
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}