"use client";

import {
  BiotechnologyIcon,
  PsychopharmacologyIcon,
  PublicationsIcon,
} from "@/public/svgIcons/Icons";
import { ChevronDown } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { IndustryHeader } from "../../../psychology-network/industry/_components/IndustryHeader";
import { IndustryNavItem } from "../../../psychology-network/industry/_components/IndustryNavItem";

export const IndustrySidebar = () => {
  const params = useParams();
  const pathname = usePathname();
  const muId = params.id as string;

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: `/mu/neuroscience-network/industry/biotechnology`,
      icon: <BiotechnologyIcon />,
      label: "Biotechnology",
    },
    {
      href: `/mu/neuroscience-network/industry/psychopharmacology`,
      icon: <PsychopharmacologyIcon />,
      label: "Psychotropics",
    },
    {
      href: `/mu/neuroscience-network/industry/publications`,
      icon: <PublicationsIcon />,
      label: "Publications",
    },
  ];

  const currentNavItem = navItems.find((item) => pathname === item.href);
  const currentPage = currentNavItem?.label || "Industries";
  const currentIcon = currentNavItem?.icon || null;

  const pageDescriptions: Record<string, string> = {
    Biotechnology:
      "Explore the latest biotech equipment releases advancing brain health research and treatment.",
    Psychopharmacology:
      "Discover cutting-edge psychopharmacological research and developments.",
    Publications:
      "Access the latest publications and research papers in the field.",
  };

  return (
      <>
         {/* Desktop View - Shows from lg (1024px) and above */}
         <div className="hidden h-full min-h-screen w-full  flex-col items-center gap-5 border-r border-borderColor bg-white lg:flex ">
           <div className="flex w-full items-center gap-2.5 border-b border-borderColor px-5 py-5">
             <h2 className="font-['Segoe_UI'] text-xl font-semibold text-[#1D1F2C]">
               Industries
             </h2>
           </div>
           <div className="flex w-full max-w-56 flex-col items-start gap-1">
             {navItems.map((item) => (
               <IndustryNavItem
                 key={item.href}
                 href={item.href}
                 icon={item.icon}
                 label={item.label}
               />
             ))}
           </div>
         </div>
   
         {/* Mobile & Tablet View - Shows below lg (1024px) */}
         <div className="w-full lg:hidden">
           <IndustryHeader
             title={currentPage}
             description={
               pageDescriptions[currentPage] ||
               "Explore the latest advancements in brain health research and treatment."
             }
           />
   
           <button
             onClick={() => setIsOpen(!isOpen)}
             className="mt-4 flex w-full items-center justify-between rounded-lg border border-borderColor bg-white px-4 py-3"
           >
             <span className="font-['Segoe_UI'] text-base font-semibold text-[#1D1F2C]">
               <div className="flex items-center gap-2">
                 {currentIcon} {currentPage}
               </div>
             </span>
             <ChevronDown
               className={`h-5 w-5 text-[#1D1F2C] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                 }`}
             />
           </button>
   
           {isOpen && (
             <div className="mt-2 flex w-full flex-col rounded-lg border border-borderColor bg-white p-2">
               {navItems.map((item) => (
                 <IndustryNavItem
                   key={item.href}
                   href={item.href}
                   icon={item.icon}
                   label={item.label}
                   onClick={() => setIsOpen(false)}
                 />
               ))}
             </div>
           )}
         </div>
       </>
  );
};
