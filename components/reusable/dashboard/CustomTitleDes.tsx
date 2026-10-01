"use client";

import React from "react";
import clsx from "clsx";

interface CustomTitleDescriptionProps {
    title: string;
    description?: string;
    className?: string;
    action?: React.ReactNode;
}

export default function CustomTitleDescription({
    title,
    description,
    className,
    action,
}: CustomTitleDescriptionProps) {
    return (

        <div className="flex justify-between items-center " >
            <div className={clsx("flex flex-col gap-2", className)}>
                <h2 className="font-['Segoe_UI'] text-[24px] font-semibold leading-[130%] tracking-[0.12px] text-[#1D1F2C]">
                    {title}
                </h2>

                {description && (
                    <p className="font-['Segoe_UI'] text-[16px] font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
                        {description}
                    </p>
                )}


            </div>

            {action && (
                <div className="flex justify-end">
                    {action}
                </div>
            )}
        </div>

    );
}