"use client";

import {
  useGetBiotechnologyPartnersQuery,
  useGetPsychologyOnePartnersQuery,
  useGetPublicationsOnePartnersQuery,
} from "@/feature/slice/biotechnologySlice";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Marquee from "react-fast-marquee";

interface Partner {
  id: string | number;
  name?: string;
  title?: string;
  partner_logo?: string;
  image?: string;
}

export default function PsychologyPartnersSlider() {
  const pathname = usePathname();

  const { data, isLoading } =
    pathname === `/mu/psychology-network/industry/biotechnology`
      ? useGetBiotechnologyPartnersQuery("biotechnology")
      : pathname === `/mu/psychology-network/industry/psychopharmacology`
        ? useGetPsychologyOnePartnersQuery("psychopharmacology")
        : pathname === `/mu/psychology-network/industry/publications`
          ? useGetPublicationsOnePartnersQuery("publications")
          : useGetBiotechnologyPartnersQuery("biotechnology");

  const navItems = [
    {
      href: `/psychology-network/industry/biotechnology`,
      label: "Biotechnology",
    },
    {
      href: `/psychology-network/industry/psychopharmacology`,
      label: "Psychopharmacology",
    },
    {
      href: `/psychology-network/industry/publications`,
      label: "Publications",
    },
  ];

  const currentPage = navItems.find((item) => pathname?.includes(item.href));
  const partners: Partner[] = data?.partners || [];

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Loading partners...
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Left Side: Header & Text */}
        <div className="w-full text-center md:col-span-5 md:text-left lg:col-span-4">
          <h3 className="font-['Segoe_UI'] text-xl font-semibold leading-[130%] tracking-[0.1px] text-headerColor xl:text-2xl">
            Mind Unite Partners
          </h3>
        </div>

        {/* Right Side: Marquee Slider */}
        <div className="w-full overflow-hidden md:col-span-7  lg:col-span-8">
          {partners.length > 0 ? (
            <Marquee
              gradient={true}
              gradientWidth={40}
              gradientColor="#fff"
              speed={45}
              pauseOnHover={true}
              className="flex items-center py-2"
            >
              {partners.map((partner, index) => {
                const imageUrl =
                  partner?.partner_logo || partner?.image || "/placeholder.png";
                const partnerName =
                  partner?.name || partner?.title || `Partner ${index + 1}`;

                return (
                  <div
                    key={partner.id || index}
                    title={partnerName}
                    className="relative mx-2 flex h-12 w-12 items-center justify-center rounded-lg   transition-transform duration-200 hover:scale-105"
                  >
                    <Image
                      src={imageUrl}
                      alt={partnerName}
                      width={100}
                      height={50}
                      className="h-full w-full object-contain"
                    />
                  </div>
                );
              })}
            </Marquee>
          ) : (
            <p className="text-center text-sm text-gray-400">
              No partners found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
