"use client";

import { scrollToTop } from "@/lib/utils";
import { DoubleArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

const LABEL_MAP: Record<string, string> = {
  home: "Home",
  mu: "Home",
  message: "Messages",
  jobs: "Jobs",
  about: "About Us",
  "about-us": "About Us",
  "contact-us": "Contact Us",
  academia: "Academia",
  "my-network": "My Network",
  "my-connection": "My Connection",
  "psychology-network": "Psychology Network",
  fields: "Fields",
  careers: "Careers",
  industry: "Industry",
  "neuroscience-network": "Neuroscience Network",
  notification: "Notifications",
  settings: "Settings",
  profile: "Profile",
  chat: "Chat",
};

function toLabel(slug: string): string {
  if (LABEL_MAP[slug]) return LABEL_MAP[slug];
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumb({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const router = useRouter();
  // Filter out dynamic numeric IDs (e.g., /mu/message/28 -> hide "28")
  const filteredSegments = segments.filter((seg, i) => {
    if (/^\d+$/.test(seg) && segments[i - 1] === "message") return false;
    return true;
  });

  const items: { label: string; href: string }[] = [];
  let cumulativePath = "";

  for (const seg of filteredSegments) {
    cumulativePath += `/${seg}`;
    items.push({
      label: toLabel(seg),
      href: seg === "mu" ? "/mu/home" : cumulativePath,
    });
  }

  // Back = parent of current, or "/" if only one level
  const backHref = items.length > 2 ? items[items.length - 2].href : "/mu/home";

  return (
    <div
      className={`flex gap-6 truncate items-center my-4 md:my-6 ${className}`}
    >
      <button
        onClick={() => router.back()}
        className="flex text-sm cursor-pointer gap-1 font-semibold text-headerColor items-center"
      >
        <IoIosArrowBack />
        Back
      </button>
      <div className="flex gap-1 text-sm items-center">
        {items.map((item, i) => (
          <span key={item.href} className="flex text-nowrap items-center gap-1">
            {i > 0 && <DoubleArrowIcon />}
            {i === items.length - 1 ? (
              <span className="text-headerColor font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                onClick={item.href === "/mu/home" ? scrollToTop : undefined}
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
