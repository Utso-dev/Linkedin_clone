"use client";

import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { MdTrendingFlat } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import { useGetTransactionStatsQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import { TransactionStatus } from "@/feature/slice/admin/subscription/subscriptionType";

const formatNumber = (value: number) => {
    return value.toLocaleString("en-US");
};

export default function TransactionStatusCard() {
    const { data: apiResponse, isLoading, isError } = useGetTransactionStatsQuery();

    const CardData: TransactionStatus[] = apiResponse?.data ?? [];

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : isError ? (
                <p>Failed to load transaction stats</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {CardData.map((item, index) => {
                        const isDown = item.direction === "down";
                        const isFlat = item.direction === "flat" || item.change_percent === null;
                        const Icon = isDown ? IoIosTrendingDown : isFlat ? MdTrendingFlat : IoIosTrendingUp;

                        return (
                            <div
                                key={index}
                                className="rounded-lg bg-white p-4 border"
                            >
                                <div className=" flex items-center justify-between">
                                    <h3 className="text-[#777980] font-['Segoe_UI'] text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
                                        {item.label}
                                    </h3>
                                    <div>
                                        <IoArrowForward className="text-[#777980]" />
                                    </div>
                                </div>
                                <p className="text-headerColor font-['Segoe_UI'] text-[32px] font-semibold leading-[130%] py-3">
                                    {formatNumber(item.value)}
                                </p>

                                <div className="flex gap-2.5 ">
                                    <div className={`flex items-center gap-1 rounded-full ${isDown ? "bg-[#FEECEE]" : isFlat ? "bg-[#F2F2F2]" : "bg-[#E9FAF7]"}  p-1`}>
                                        <Icon
                                            size={20}
                                            className={
                                                isDown
                                                    ? "text-[#EB3D4D] rotate-120 "
                                                    : isFlat
                                                        ? "text-[#777980]"
                                                        : "text-primaryColor "
                                            }
                                        />

                                        <span
                                            className={
                                                isDown
                                                    ? "text-[#EB3D4D] font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                                    : isFlat
                                                        ? "text-[#777980] font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                                        : "text-primaryColor font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                            }
                                        >
                                            {item.change_percent !== null ? `${item.change_percent}%` : "-"}
                                        </span>
                                    </div>

                                    <p className="text-[#777980] font-['Segoe_UI'] text-[12px] font-normal leading-[132%] tracking-[0.06px] flex justify-center items-center">
                                        VS previous month
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}