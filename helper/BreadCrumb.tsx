"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { RightAngleIcon } from "@/public/svgIcons/Icons";

export interface BreadLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function BreadCrumb({ links }: { links: BreadLink[] }) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || undefined;
  const queryString = searchParams.toString();
 
  return (
    <div className="py-3">
      <div className="flex items-center gap-2 text-white">

        {links.map((link, index) => {
          const isLast = index === links.length - 1;
          return (
            <div className="flex items-center gap-2" key={index}>
              {index > 0 && <RightAngleIcon className="h-4 w-4 text-descriptionColor" />}

              {/* If not last item → make it clickable */}
              {!isLast && link.href ? (
                <Link
                  href={link.href + `${redirectUrl ? `${link.href.split("?")?.length > 2 ? "&" : "?"}redirect=${redirectUrl.split("_").slice(0, index+1 ).join("_")}` : ''}`}
                  className="hover:underline text-sm font-medium text-descriptionColor"
                >
                  {link.label}
                </Link>
              ) : (
                <span className="text-sm font-normal text-descriptionColor opacity-80">
                  {link.label}
                </span>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
