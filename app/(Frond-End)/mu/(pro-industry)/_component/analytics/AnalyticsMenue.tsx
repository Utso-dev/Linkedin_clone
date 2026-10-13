"use client";

import { scrollToTop } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AnalyticsMenue({
  menuData,
  initialPath,
}: {
  menuData: { id: number; title: string; href: string }[];
  initialPath?: string;
}) {
  const pathName = usePathname();
  const isActive = (href: string): boolean => {
    if (href === initialPath) {
      return pathName === initialPath;
    }
    return pathName.startsWith(href);
  };
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className=" my-2 max-w-full md:max-w-auto w-full flex gap-3  items-center  ">
        {menuData.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            onClick={scrollToTop}
            className={`text-sm  border text-nowrap font-semibold hover:shadow-md rounded-full text-grayColor1  py-2 px-3 ${isActive(menu.href) ? "text-whiteColor bg-primaryColor border-primaryColor transition-all duration-200" : ""}`}
          >
            {menu.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsMenue;
