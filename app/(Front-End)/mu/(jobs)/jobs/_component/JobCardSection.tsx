"use client";

import React from "react";

interface JobCardSectionProps {
  title: string;
  subtitle: string;

  showAllPath?: string;
  showAllParams?: Record<string, string | number | boolean | undefined>;
  showAllLabel?: string;
}

export const JobCardSection: React.FC<JobCardSectionProps> = ({
  title,
  subtitle,
}) => {
  return (
    <section className=" ">
      <div>
        <h2 className="text-xl font-bold text-[#1D1F2C]">{title}</h2>
        <p className="text-xs text-[#777986] mt-0.5">{subtitle}</p>
      </div>
    </section>
  );
};
