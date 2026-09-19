"use client";

import { useEffect, useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import GradProgramsTable from "./_components/GradProgramsTable";
import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Limits } from "@/public/staticData";
import { useGetUndergradGradProgramsQuery } from "@/feature/slice/academia/academiaSlice";
import { useParams } from "next/navigation";
import TableLoading from "./_components/TableLoading";
import { useSearchParams } from "next/navigation";

const degreeTokens = [
  { key: "BS", label: "BS" },
  { key: "BA", label: "BA" },
  { key: "Sc.B.", label: "Sc.B." },
  { key: "A.B.", label: "A.B." },
  { key: "BAS", label: "BAS" },
  { key: "MS", label: "MS" },
  { key: "MA", label: "MA" },
  { key: "MRes", label: "MRes" },
  { key: "M.Ed.", label: "M.Ed." },
  { key: "MSEd", label: "MSEd" },
  { key: "MSP", label: "MSP" },
  { key: "MASS", label: "MASS" },
  { key: "EdS", label: "EdS" },
  { key: "PhD", label: "PhD" },
  { key: "PsyD", label: "PsyD" },
  { key: "EdD", label: "EdD" },
];
export default function page() {
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [searchItem, setSearchItem] = useState<string>("");
  const [isAccending, setIsAccending] = useState<boolean>(true);

  const params = useParams();
  const { data, isLoading, isFetching, error } =
    useGetUndergradGradProgramsQuery({
      id: params.stateId,
      limit,
      page,
      searchItem,
      degree: selectedDegree === "all" ? "" : selectedDegree,
      sort: isAccending ? "asc" : "desc",
    });

  // if(isLoading){
  //     return(
  //         <TableLoading />
  //     )
  // }

  const handleSearch = (query: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", query);
    setSearchItem(query);
    console.log(searchParams.toString());
  };

  useEffect(() => {
    setPage(1);
  }, [selectedDegree, searchItem, limit]);

  return (
    <div className="xl:pl-6 space-y-6">
      <AcademiHeader
        title="Degree Programs"
        description="Select a University and Click Map Pin for Website."
        selectedDegree={selectedDegree}
        setSelectedDegree={setSelectedDegree}
        filterData={degreeTokens}
        onSearch={handleSearch}
        searchPlaceHolder="Search Degree/ University..."
      />

      {isFetching || isLoading ? (
        <TableLoading />
      ) : (
        <GradProgramsTable
          data={data?.data || []}
          filter={isAccending}
          setFilter={setIsAccending}
          currentPage={page}
          limit={limit}
        />
      )}
      <div className="flex items-center gap-4 justify-end">
        <Pagination
          page={page}
          pageSize={limit}
          total={data?.total || 10}
          totalPages={data?.total_page || 1}
          onPageChange={(page) => setPage(page)}
        />
        <div className="mt-5">
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
          }}
        >
          <SelectTrigger className="bg-white min-w-20 focus-visible:border-[#A5A5AB] focus-visible:ring-0">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Limits.map((item) => (
                <SelectItem key={item} value={item.toString()}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
      </div>
    </div>
  );
}
