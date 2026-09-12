"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    className?: string;
    containerClassName?: string;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    disabled?: boolean;
}

export function DatePicker({
    date,
    setDate,
    placeholder = "Select date",
    label,
    required,
    error,
    helperText,
    className,
    containerClassName,
    align = "start",
    side = "bottom",
    disabled = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("w-full", containerClassName)}>
            {label && (
                <label className="mb-1.5 block text-[#4A4C56] font-['Segoe_UI'] text-base not-italic font-semibold leading-6 tracking-[0.08px]">
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger
                    id="date"
                    disabled={disabled}
                    className={cn(
                        "flex h-[48px] w-full  items-center justify-start gap-2 rounded-lg border border-gray-300 bg-white px-3.5 text-left text-sm font-normal transition-all outline-none hover:bg-gray-50 focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                        !date ? "text-gray-400" : "text-gray-900",
                        error ? "border-red-500" : "",
                        className
                    )}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">
                        {date ? format(date, "MMM d, yyyy") : placeholder}
                    </span>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto z-[100000] bg-white rounded-lg shadow-xl border border-gray-200"
                    align={align}
                    side={side}
                    sideOffset={4}
                >
                    <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={(value) => {
                            setDate(value);
                            setIsOpen(false);
                        }}
                        numberOfMonths={1}
                        className="rounded-md"
                    />
                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => setDate(undefined)}
                            className="text-xs text-[#6B7280] hover:text-[#151513]"
                        >
                            Clear
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            {!error && helperText && (
                <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
