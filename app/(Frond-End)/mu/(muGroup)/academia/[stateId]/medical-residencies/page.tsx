"use client";

import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetResidenciesQuery } from "@/feature/slice/academia/academiaSlice";
import { Limits } from "@/public/staticData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import TableLoading from "../grad-undergrad-programs/_components/TableLoading";
import MedResidencyTable from "./_components/MedResidencyTable";

export default function page() {
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [searchItem, setSearchItem] = useState<string>("");
  const { stateId } = useParams();
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [isAccending, setIsAccending] = useState<boolean>(true);

  const { data, isLoading, isFetching, error } = useGetResidenciesQuery({
    id: stateId,
    limit,
    page,
    searchItem,
    degree: selectedDegree !== "all" ? selectedDegree : undefined,
    sort: isAccending ? "asc" : "desc",
  });

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
        title="Residency Programs"
        onSearch={handleSearch}
        searchPlaceHolder="Search Degree/ University..."
        filterData={[
          {
            label: "MD-PhD",
            key: "MD-PhD",
          },
          {
            label: "MD-DO",
            key: "MD-DO",
          },
        ]}
        selectedDegree={selectedDegree}
        setSelectedDegree={setSelectedDegree}
      />
      {isFetching || isLoading ? (
        <TableLoading />
      ) : (
        <MedResidencyTable
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
