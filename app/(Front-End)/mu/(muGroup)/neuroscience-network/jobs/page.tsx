"use client";

import Breadcrumb from "@/app/(Front-End)/_components/Breadcrumb";
import { useGetJobCountByCityQuery } from "@/feature/slice/jobs/jobSlice";
import { UsaMapIcon } from "@/public/svgIcons/UsaMap";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useGetJobCountByCityQuery({
    network_type: "neuroscience",
  });
  const jobCountData = data?.data;

  return (
    <section className=" sm:pb-14!  md:pb-16!  lg:pb-20!">
      <Breadcrumb />
      <div
        className="h-fit space-y-4 md:space-y-6 py-10 px-4 sm:px-8 md:px-16 lg:px-32 sm:py-12  rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl"
        style={{
          background:
            "linear-gradient(179deg, rgba(253, 253, 253, 0.10) -63.29%, rgba(1, 120, 242, 0.10) 98.84%)",
        }}
      >
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-semibold leading-[130%] text-headerColor text-center">
          Select a State
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-10 h-10 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <UsaMapIcon
            className="w-full"
            data={jobCountData}
            countLabel="Active Jobs"
            onStateClick={(state, stateData) => {
              const targetId = stateData?.state_id || state.id;
              router.push(
                `/mu/jobs?network_type=neuroscience&state_id=${targetId}`,
              );
            }}
          />
        )}
      </div>
    </section>
  );
}
