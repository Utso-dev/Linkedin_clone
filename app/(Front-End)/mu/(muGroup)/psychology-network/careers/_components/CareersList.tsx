// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/careers/_components/CareersList.tsx

"use client";

import { useMemo } from "react";
import { CareerSection } from "../_mock/careersData";
import { CareerSectionItem } from "./CareerSectionItem";

interface CareersListProps {
  sections: CareerSection[];
  searchQuery?: string;
}

export const CareersList = ({
  sections,
  searchQuery = "",
}: CareersListProps) => {
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    return sections.filter((section) => {
      const sectionText = section.titleParts.map((p) => p.text).join("");
      return (
        sectionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.subSections.some(
          (sub) =>
            sub.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.bulletPoints.some((point) =>
              point.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        )
      );
    });
  }, [sections, searchQuery]);

  if (searchQuery.trim() && filteredSections.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-12">
        <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base md:text-lg">
          No careers found matching "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 md:gap-10">
      {filteredSections.map((section) => (
        <CareerSectionItem key={section.id} section={section} />
      ))}
    </div>
  );
};
