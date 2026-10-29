"use client";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import Search from "@/components/reusable/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ConnectionListHeader({ data }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSort, setSelectedSort] = useState("");

  const sortOptions = [
    { value: "recent", label: "Recent" },
    { value: "az", label: "Name (A-Z)" },
    { value: "za", label: "Name (Z-A)" },
  ];

  useEffect(() => {
    const sortParam = searchParams.get("sort") || "";
    if (sortParam) {
      setSelectedSort(sortParam);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (selectedSort) {
      params.set("sort", selectedSort);
    } else {
      params.delete("sort");
    }
    const nextQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");
    if (nextQuery === currentQuery) return;
    router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
      scroll: false,
    });
  }, [selectedSort, pathname, router]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row w-full justify-between items-center">
        <h1 className="text-base text-nowrap lg:text-xl md:block hidden font-semibold text-headerColor">
          Total Connections{" "}
          <span className="font-normal text-grayColor1">
            ({data?.total || 0})
          </span>
        </h1>
        <div className="flex gap-4 justify-between w-full items-center">
          <h1 className="text-base md:hidden font-semibold text-headerColor">
            Total Connections{" "}
            <span className="font-normal text-grayColor1">
              ({data?.total || 0})
            </span>
          </h1>
          <div className="relative w-55 lg:w-75 mx-auto hidden md:block  max-w-full">
            <Search placeHolder="Search connection..." />
          </div>
          <div className="flex items-center ">
            <span className="text-grayColor1 hidden lg:block text-nowrap">
              Sort by:
            </span>
            <SelecteInputField
              value={selectedSort}
              onValueChange={setSelectedSort}
              options={sortOptions}
              placeholder="Sort by"
              className="h-12! md:h-13! border-none! px-1! shadow-none! font-semibold shadow-transparent! text-[14px]"
            />
          </div>
        </div>
        <div className="relative w-full  mx-auto md:hidden  max-w-full">
          <Search />
        </div>
      </div>
    </div>
  );
}

export default ConnectionListHeader;
