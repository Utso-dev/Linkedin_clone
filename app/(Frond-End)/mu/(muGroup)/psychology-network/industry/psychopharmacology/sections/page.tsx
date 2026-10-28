"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetBiotechnologyQuery } from "@/feature/slice/biotechnologySlice";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EquipmentGrid } from "../../biotechnology/_components";

export default function PsychopharmacologySectionsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const queryParams = useMemo(
    () => ({
      network_type: "psychology",
      industry_type: "psychotropics",
      view: "overview",
      ...(search.trim() ? { search: search.trim() } : {}),
    }),
    [search],
  );

  const { data, isLoading } = useGetBiotechnologyQuery(queryParams);

  const sections = useMemo(() => {
    const raw = data?.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.sections)) return raw.sections;
    return [];
  }, [data]);

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
                  />
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
