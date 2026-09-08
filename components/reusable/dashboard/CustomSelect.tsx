"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface SelectOption {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    label?: string;
    options: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select State",
    error,
    required,
    disabled = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const visibleCount = 4;
    const visibleOptions = showAll ? options : options.slice(0, visibleCount);

    // Outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setShowAll(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setShowAll(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="mb-1.5 block text-[#4A4C56] font-['Segoe_UI'] text-[16px] not-italic font-semibold leading-[24px] tracking-[0.08px]">
                    {label}
                    {required && <span className="ml-0.5">*</span>}
                </label>
            )}

            {/* Trigger */}
            <div
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                className={twMerge(
                    `
                flex w-full h-[48px]
                items-center justify-between
                rounded-lg border bg-white
                px-3.5 text-sm cursor-pointer
                transition-all select-none
                `,
                    className,
                    disabled
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-400",
                    error ? "border-red-500" : "",
                    isOpen
                        ? "border-gray-400 ring-1 ring-gray-400/20"
                        : ""
                )}
            >
                <span className={!selectedOption ? "text-gray-400" : "text-gray-900"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-gray-600" : ""
                        }`}
                />
            </div>

            {/* Dropdown - inline absolute */}
            {isOpen && (
                <div className="absolute top-full  left-0 right-0 -mt-12 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-[9999]">
                    <div className="py-1">
                        {visibleOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                    px-3.5 py-2.5 text-sm cursor-pointer transition-colors
                    ${option.value === value
                                        ? "bg-gray-50 font-medium text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }
                  `}
                            >
                                {option.label}
                            </div>
                        ))}

                        {!showAll && options.length > visibleCount && (
                            <div
                                onClick={() => setShowAll(true)}
                                className="px-3.5 py-2.5 text-sm text-gray-400 cursor-pointer hover:bg-gray-50 border-t border-gray-100"
                            >
                                Show more...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default CustomSelect;


