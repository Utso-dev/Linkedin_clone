"use client";

import { PublicationDataType } from "@/lib/type";
import dayjs from "dayjs";
import { ChevronRight, Dot } from "lucide-react";
import Link from "next/link";

interface PublicationCardProps {
  publication: PublicationDataType;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  return (
    <div className="group flex w-full flex-col items-start gap-3.25 self-stretch border-b border-borderColor md:p-3 py-3 hover:bg-sectionColor">
      {/* Journal and Tag Row */}
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C] group-hover:text-primaryColor">
          {publication.title}
        </h4>
        {publication.publication_type && (
          <span className="flex items-center gap-4 rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
            {publication.publication_type}
          </span>
        )}
      </div>

      {/* Title / Description */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-grayColor1">
        {publication.short_abstract || publication.abstract}
      </p>
      <div className="">
        {publication.authors.length > 0 && (
          <div className="font-['Segoe_UI'] flex flex-wrap items-center gap-1.5 text-sm text-grayColor1">
            {publication.authors.map((author, index) => (
              <p
                key={index}
                className="px-3 py-1 text-primaryColor leading-[120%] rounded-full bg-lightGreenColor/50 "
              >
                {author}
              </p>
            ))}
          </div>
        )}
      </div>
      {/* Date, Meta, and Button Row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex items-center ">
            {publication.created_at && (
              <p className=" font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-grayColor1">
                {dayjs(publication.created_at).format("DD MMM YYYY")}
              </p>
            )}
            <Dot className="text-grayColor1" />
            {publication.network_type && (
              <span className="font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-grayColor1">
                {publication.network_type}
              </span>
            )}
          </div>
          {publication.website_url || publication.attachment_url ? (
            <Link
              href={
                publication.website_url || publication.attachment_url || "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primaryColor hover:underline"
            >
              <span className="text-center font-['Arial'] text-sm font-normal leading-5">
                Learn more
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button className="flex items-center gap-1 text-primaryColor hover:underline">
              <span className="text-center font-['Arial'] text-sm font-normal leading-5">
                Learn more
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
