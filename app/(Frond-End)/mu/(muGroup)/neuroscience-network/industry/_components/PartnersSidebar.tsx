// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/PartnersSidebar.tsx

"use client";

import {
  useGetNeuroscienceBiotechnologyPartnersQuery,
  useGetNeuroscienceOnePartnersQuery,
  useGetNeurosciencePublicationsOnePartnersQuery,
} from "@/feature/slice/neuroscienceSlice";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { PaginationDots } from "../../../psychology-network/industry/_components/PaginationDots";
import { PartnerCard } from "../../../psychology-network/industry/_components/PartnerCard";


export const PartnersSidebar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  const { data } =
    pathname === `/mu/neuroscience-network/industry/biotechnology`
      ? useGetNeuroscienceBiotechnologyPartnersQuery("biotechnology")
      : pathname === `/mu/neuroscience-network/industry/psychopharmacology`
        ? useGetNeuroscienceOnePartnersQuery("psychopharmacology")
        : pathname === `/mu/neuroscience-network/industry/publications`
          ? useGetNeurosciencePublicationsOnePartnersQuery("publications")
          : useGetNeuroscienceBiotechnologyPartnersQuery("biotechnology");

  const navItems = [
    {
      href: `/neuroscience-network/industry/biotechnology`,
      label: "Biotechnology",
    },
    {
      href: `/neuroscience-network/industry/psychopharmacology`,
      label: "Psychopharmacology",
    },
    {
      href: `/neuroscience-network/industry/publications`,
      label: "Publications",
    },
  ];

  const currentPage = navItems.find((item) => pathname === item.href);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setCurrentIndex(newIndex);
  };


  return (
    <div className="flex h-auto w-full flex-col items-start gap-6 lg:bg-bgLightColor p-5 lg:h-253.5 rounded-lg border border-[#ECEFF3]">
      {/* Header */}
      <div className="flex w-full flex-col items-start gap-2 self-stretch">
        <h3 className="font-['Segoe_UI'] text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
          Mind Unite Partners
        </h3>
        <p className="font-['Segoe_UI'] text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
          Leading {currentPage?.label} companies advancing brain health research
          and treatment.
        </p>
      </div>

      {/* Desktop View - Vertical List */}
      <div className="hidden w-full flex-col lg:flex">
        {data?.partners?.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Mobile View - Horizontal Scrollable Cards */}
      <div className="w-full min-w-0 flex flex-col gap-4 lg:hidden">
        <div
          className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {data?.partners?.map((partner) => (
            <div key={partner.id} className="w-full shrink-0 snap-center">
              <PartnerCard partner={partner} isMobile />
            </div>
          ))}
        </div>

        {/* Pagination Dots for Mobile */}
        <div className="flex w-full justify-center">
          <PaginationDots
            total={data?.partners?.length || 0}
            activeIndex={currentIndex}
            onDotClick={(index) => {
              setCurrentIndex(index);
              const container = document.querySelector(".snap-x");
              if (container) {
                container.scrollTo({
                  left: index * container.clientWidth,
                  behavior: "smooth",
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
