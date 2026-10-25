"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetBiotechnologyQuery } from "@/feature/slice/biotechnologySlice";
import { IndustryDataType } from "@/lib/type";
import { EquipmentGrid } from "./_components";

export default function BiotechnologyPage() {
  const { data, isLoading } = useGetBiotechnologyQuery("biotechnology");

  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-1 flex-col min-w-0">
        <div className="flex w-full flex-col  gap-10 py-6 min-w-0">
          {isLoading ? (
            <IndustrySkleton />
          ) : (
            data?.data?.sections?.map((section: IndustryDataType) => (
              <div
                className="flex w-full flex-col  gap-6 min-w-0"
                key={section?.id}
              >
                <h3 className=" font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
                  {section?.name || "Section Title"}
                </h3>
                <EquipmentGrid industryData={section.industry_category} />
              </div>
            ))
          )}

          {/* <div className="flex w-full flex-col items-stretch gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Psychological Assessment Instruments
            </h3>
            <AssessmentGrid />
          </div>

          <div className="flex w-full flex-col items-stretch gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Experimental Apparatus (Behavioral and Cognitive)
            </h3>
            <ApparatusGrid />
          </div>

          <div className="flex w-full flex-col items-stretch gap-6 pb-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              General Lab and Clinical Infrastructure
            </h3>
            <LabInfrastructureGrid />
          </div> */}
        </div>
      </div>
    </div>
  );
}
