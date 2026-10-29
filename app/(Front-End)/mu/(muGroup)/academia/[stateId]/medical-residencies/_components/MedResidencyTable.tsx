"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { MedicalResidencyPrograms } from "@/public/demoData/DemoData";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type Props = {
  data: any[];
  filter?: boolean;
  setFilter?: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  limit: number;
}

export default function MedResidencyTable({ data, filter, setFilter, currentPage, limit }: Props) {
  const params = useParams();
  const stateId = params.stateId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const getRedirectWithoutLast = (r?: string) => {
    if (!r) return undefined;
    const parts = r.split("_");
    parts.pop();
    const next = parts.join("_");
    return next || undefined;
  };

  const columns = [
    {
      label: "SL",
      accessor: "__",
      width: "30px",
      formatter: (accessor: string, row: any, index: number) => (
        <div className="w-full h-full text-start pl-2 text-[#0B0B0B]">
          {(index + 1) + (currentPage - 1) * limit}
        </div>
      ),
    },
    {
      label: "Universities",
      accessor: "program_name",
      width: "300px",
      sortable: true,
      sortFunction: () => {
        if (setFilter) {
          setFilter((prev) => !prev);
        }
      },
      formatter: (accessor: string, row: any) => (
        <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
          {accessor}
        </div>
      ),
    },
    {
      label: "Degrees",
      accessor: "degree_types",
      width: "170px",
      position: "justify-center",
      formatter: (accessor: string[], row: any) => (
        <div className="w-full h-full text-center pl-2 py-3 text-[#0B0B0B]">
          {accessor?.join(", ") || "--"}
        </div>
      ),
    },
    {
      label: "Location",
      accessor: "location",
      width: "170px",
      position: "justify-center",
      formatter: (accessor: string, row: any) => (
        <div className="w-full h-full text-center pl-2 py-3 text-[#0B0B0B] whitespace-nowrap">
          {accessor}
        </div>
      ),
    },
  ];

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={data}
        header={{
          position: "justify-start",
          padding: "8px 0px 8px 8px",
          bg: "#E9E9EA",
          text: "#0B0B0B",
          fontWeight: "600",
          fontSize: "16px",
          rounded: "8px",
        }}
        rowStyle={{
          hover: true,
          hoverbg: "hover:bg-[#ECEFF3]",
          rowClickable: true,
          rowClickCheck: "latitude,longitude",
          rowClick: (row: any) => {
            const params = new URLSearchParams(window.location.search);
            params.set("location", `${row.latitude},${row.longitude}`);
            if (redirect) {
              const newRedirect = getRedirectWithoutLast(redirect);
              if (newRedirect) params.set("redirect", newRedirect);
              else params.delete("redirect");
            }

            if(row?.latitude && row?.longitude && stateId){
                router.push(`/mu/academia/${stateId}?${params.toString()}`);
            }
          },
        }}
        sortConfig={{
          key: "program_name",
          direction: filter ? "ascending" : "descending",
        }}
      />
    </div>
  );
}
