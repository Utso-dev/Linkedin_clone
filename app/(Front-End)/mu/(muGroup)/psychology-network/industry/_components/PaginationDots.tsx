
"use client";

import { ActiveDots, InactiveDots } from "@/public/svgIcons/Icons";

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  onDotClick?: (index: number) => void;
}

export const PaginationDots = ({
  total,
  activeIndex,
  onDotClick,
}: PaginationDotsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className="flex items-center justify-center p-1"
        >
          {index === activeIndex ? <ActiveDots /> : <InactiveDots />}
        </button>
      ))}
    </div>
  );
};
