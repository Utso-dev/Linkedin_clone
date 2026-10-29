// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/careers/_components/CareerSubSection.tsx

"use client";

import { useState } from "react";
import { CareerSubSection } from "../_mock/careersData";

interface CareerSubSectionProps {
  subSection: CareerSubSection;
}

export const CareerSubSectionItem = ({ subSection }: CareerSubSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col items-start gap-3 self-stretch px-4 py-2 md:px-8 ${
        isHovered ? "bg-[#F8FAFB]" : "bg-none"
      }`}
    >
      <h4
        className={`self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] underline decoration-solid md:text-lg ${
          isHovered ? "text-[#04A1B7]" : "text-[#1D1F2C]"
        }`}
      >
        {subSection.heading}
      </h4>
      <ul className="flex list-disc flex-col gap-2 pl-6">
        {subSection.bulletPoints.map((point, index) => (
          <li
            key={index}
            className="text-[#1D1F2C] font-['Segoe_UI'] text-sm leading-[150%] md:text-base"
          >
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};
