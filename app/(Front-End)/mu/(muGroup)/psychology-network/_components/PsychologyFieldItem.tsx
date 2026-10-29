"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";


interface PsychologyFieldItemProps {
  field: any;
}

export const PsychologyFieldItem = ({ field }: PsychologyFieldItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Layout - Always expanded */}
      <div className="hidden w-full flex-col items-start gap-3 self-stretch border-b border-[#DFE1E7] p-3 hover:bg-[#F6F8FA] md:flex">
        <h3 className="flex-1 text-[#04A1B7] font-['Segoe_UI'] text-2xl font-semibold leading-[130%] tracking-[0.12px] decoration-solid">
          {field.category}
        </h3>
        <ul className="flex flex-1 list-disc flex-col gap-2 pl-6">
          {field.bulletPoints.map((point, index) => (
            <li
              key={index}
              className="text-[#1D1F2C] font-['Segoe_UI'] text-base leading-[150%]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Layout - Accordion */}
      <div className="w-full border-b border-[#DFE1E7] md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-3 hover:bg-[#F6F8FA]"
        >
          <h3 className="flex-1 text-left text-[#04A1B7] font-['Segoe_UI'] text-lg font-semibold leading-[130%] tracking-[0.12px] underline decoration-solid">
            {field.category}
          </h3>
          <ChevronDown
            className={`h-5 w-5 text-[#04A1B7] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="px-3 pb-3">
            <ul className="flex flex-1 list-disc flex-col gap-2 pl-6">
              {field.bulletPoints.map((point, index) => (
                <li
                  key={index}
                  className="text-[#1D1F2C] font-['Segoe_UI'] text-sm leading-[150%]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
