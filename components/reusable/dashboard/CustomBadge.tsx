// components/reusable/dashboard/CustomBadge.tsx

import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?:
    | "gray"
    | "yellow"
    | "orange"
    | "blue"
    | "cyan"
    | "green"
    | "red"
    | "purple"
    | "active"
    | "suspended"
    | "logout";
  className?: string;
};

const colorStyles = {
  gray: "bg-[#E5E5E5] text-[#4A4C56] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#A5A5AB] py-1.5 px-2.5",
  yellow:
    "bg-[#FFFAE7] text-[#4A4C56] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#FBDE6E] py-1.5 px-2.5",
  orange:
    "bg-[#FFEFE6] text-[#FF5A00] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#FFBE8A] py-1.5 px-2.5",
  blue: "bg-[#E6F1FF] text-[#006EFF] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#006EFF] py-1.5 px-2.5",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-200 py-1.5 px-2.5",
  green:
    "bg-[#E9FAF7] text-[#04A1B7] bg-[#04A1B7] text-right font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] border border-[#04A1B7] py-1.5 px-2.5",
  red: "bg-red-50 text-red-600 border-red-200 py-1.5 px-2.5",
  purple:
    "text-[#6B4DFF] text-center font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] bg-[#F0EDFF] border border-[#D1C8FF] py-1.5 px-2.5",

  active:
    "inline-flex items-center gap-1.5 px-3 py-1 text-[#22CAAD] text-center font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] bg-[#E9FAF7] border border-[#7ADFCE] rounded-full py-1.5",
  suspended:
    "inline-flex items-center gap-1.5 px-3 py-1 text-[#A5A5AB] text-center font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] bg-[#FEECEE] border border-[#F38B94] rounded-full py-1.5",
  logout:
    "inline-flex items-center gap-1.5 px-3 py-1 text-[#EB3D4D] text-center font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px] bg-[#FEECEE] border border-[#F38B94] rounded-full py-1.5",
};

export default function CustomBadge({
  children,
  color = "gray",
  className = "",
}: BadgeProps) {
  const getDotColor = () => {
    if (color === "suspended") return "bg-[#EB3D4D]";
    if (color === "active") return "bg-[#22CAAD]";
    if (color === "logout") return "bg-[#A5A5AB]";
    return null;
  };

  const dotColor = getDotColor();

  return (
    <span
      className={`inline-flex items-center rounded-md text-xs font-medium border ${colorStyles[color]} ${className}`}
    >
      {dotColor && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      )}

      {children}
    </span>
  );
}
