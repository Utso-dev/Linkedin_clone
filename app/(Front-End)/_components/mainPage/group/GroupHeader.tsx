"use client";
import Search from "@/components/reusable/Search";
import { useState } from "react";
import CreateGroupForm from "./GroupCreateModal";

function GroupHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-2">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Groups{" "}
        </h2>
        <div className="flex  items-center gap-3">
          <div className="relative w-75 hidden md:block  max-w-full">
            <Search placeHolder="Search Group" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Create Group"
            className="rounded-full border border-primaryColor px-4 py-1.5 font-semibold text-base leading-[140%]  text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-whiteColor hover:shadow-md shadow-primaryColor/50 tracking-wide transition-all duration-200"
          >
            Create Group
          </button>
        </div>

        <div className="relative w-75 mx-auto md:hidden  max-w-full">
          <Search />
        </div>
      </div>
      {isOpen && <CreateGroupForm open={isOpen} setOpen={setIsOpen} />}
    </div>
  );
}

export default GroupHeader;
