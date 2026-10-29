// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/careers/_components/CareerSectionItem.tsx

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CareerSection } from "../_mock/careersData";
import { CareerSubSectionItem } from "./CareerSubSection";

interface CareerSectionItemProps {
  section: CareerSection;
}

export const CareerSectionItem = ({ section }: CareerSectionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Layout - Always expanded */}
      <div className="hidden w-full flex-col items-start gap-6 self-stretch border-b border-[#DFE1E7] pb-5 md:flex">
        <h3 className="self-stretch font-['Segoe_UI'] text-2xl leading-[130%] tracking-[0.12px]">
          {section.titleParts.map((part, index) => (
            <span
              key={index}
              className={
                part.isHighlighted
                  ? "font-semibold text-[#04A1B7]"
                  : "font-normal text-[#777980]"
              }
            >
              {part.text}
            </span>
          ))}
        </h3>

        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {section.subSections.map((subSection) => (
            <CareerSubSectionItem key={subSection.id} subSection={subSection} />
          ))}
        </div>
      </div>

      {/* Mobile Layout - Accordion */}
      <div className="w-full border-b border-[#DFE1E7] md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between py-3 hover:bg-[#F6F8FA]"
        >
          <h3 className="flex-1 text-left font-['Segoe_UI'] text-lg leading-[130%] tracking-[0.12px]">
            {section.titleParts.map((part, index) => (
              <span
                key={index}
                className={
                  part.isHighlighted
                    ? "font-semibold text-[#04A1B7]"
                    : "font-normal text-[#777980]"
                }
              >
                {part.text}
              </span>
            ))}
          </h3>
          <ChevronDown
            className={`h-5 w-5 text-[#04A1B7] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="flex w-full flex-col pb-4">
            <div className="grid w-full grid-cols-1 gap-6">
              {section.subSections.map((subSection) => (
                <CareerSubSectionItem
                  key={subSection.id}
                  subSection={subSection}
                />
              ))}
            </div>

            {/* View Button with Right Arrow */}
            <div className="justify-end flex w-full">
              <button className="mt-4 flex w-fit items-center gap-2 rounded-full border border-[#04A1B7] px-4 py-2 text-[#04A1B7] font-['Segoe_UI'] text-sm font-medium transition hover:bg-[#04A1B7] hover:text-white">
                View
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
