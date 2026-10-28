"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetBiotechnologyQuery } from "@/feature/slice/biotechnologySlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EquipmentGrid } from "../../../_components";

export default function NeuroscienceBiotechnologySectionsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const queryParams = useMemo(
    () => ({
      network_type: "neuroscience",
      industry_type: "biotechnology",
      view: "overview",
      ...(search.trim() ? { search: search.trim() } : {}),
    }),
    [search],
  );

  const { data, isLoading } = useGetBiotechnologyQuery(queryParams);

  const raw = data?.data;
  const sections = raw ? raw : raw?.sections || [];

  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-1 flex-col min-w-0">
        <div className="flex w-full flex-col gap-10 py-6 min-w-0">
          {isLoading ? (
            <IndustrySkleton />
          ) : sections.length > 0 ? (
            sections.map((section: any) => {
              const sectionId = section?.section_id || section?.id;
              const sectionName =
                section?.section_name || section?.name || "Section Title";
              const categories =
                section?.categories || section?.industry_category || [];
              const products = section?.products || [];
              console.log(sectionId, "sectionId");

              return (
                <div
                  className="flex w-full flex-col gap-6 min-w-0"
                  key={sectionId}
                >
                  <h3 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
                    {sectionName}
                  </h3>
                  <EquipmentGrid
                    industryData={categories}
                    initialProducts={products}
                    sectionId={sectionId}
                  />
                  <div className="flex w-full items-center justify-center pt-2">
                    <Link
                      href={`/mu/neuroscience-network/industry/biotechnology/${sectionId}`}
                      className="text-whiteColor px-4 py-2 rounded-sm bg-primaryColor hover:shadow-md "
                    >
                      View All
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex w-full justify-center py-16">
              <p className="text-liteDescriptionColor font-['Segoe_UI'] text-base">
                {search
                  ? `No sections found matching "${search}".`
                  : "No sections available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
