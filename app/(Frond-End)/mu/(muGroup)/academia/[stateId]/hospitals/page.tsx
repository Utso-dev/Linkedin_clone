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
import { useGetHospitalsQuery } from "@/feature/slice/academia/academiaSlice";
import { Limits } from "@/public/staticData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import HospitalLoading from "./_components/HospitalLoading";
import HospitalTable from "./_components/HospitalTable";
import ResidencyTable from "./_components/ResidencyTable";
import StateInstitutionTable from "./_components/StateInstitutionTable";

const tabs = [
  { label: "University Hospitals", value: "university_hospital" },
  { label: "State Institutions", value: "state_institution" },
  { label: "Veterans Affairs (VA) Facilities", value: "va_facility" },
];

export default function page() {
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("university_hospital");
  const { stateId } = useParams();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isAccending, setIsAccending] = useState<boolean>(true);

  const { data, isLoading, isFetching, error } = useGetHospitalsQuery({
    id: stateId,
    type: activeTab,
    limit,
    page,
    sort: isAccending ? "asc" : "desc",
  });

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab, limit]);

  return (
    <div className="xl:pl-6 space-y-6">
      <AcademiHeader title="University Hospitals & State Institutions" />
      <div>
        <div className="flex w-fit bg-gray-200 rounded-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === tab.value
                  ? "bg-primaryColor text-white rounded-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:rounded-md transition-colors duration-300"
              }`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading || isFetching ? (
        <HospitalLoading />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeTab === "state_institution" && (
            <StateInstitutionTable
              data={data?.data || []}
              filter={isAccending}
              setFilter={setIsAccending}
              currentPage={page}
              limit={limit}
            />
          )}
          {activeTab === "university_hospital" && (
            <HospitalTable
              data={data?.data || []}
              filter={isAccending}
              setFilter={setIsAccending}
              currentPage={page}
              limit={limit}
            />
          )}
          {activeTab === "va_facility" && (
            <ResidencyTable
              data={data?.data || []}
              filter={isAccending}
              setFilter={setIsAccending}
              currentPage={page}
              limit={limit}
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-4 justify-end " >
        <Pagination
          page={page}
          pageSize={limit}
          total={data?.total || 1}
          totalPages={data?.total_page || 1}
          onPageChange={(page) => setPage(page)}
        />
        <div className="mt-5">
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
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
