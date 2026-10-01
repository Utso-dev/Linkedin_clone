"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownToLine,
  ArrowUpDown,
  Download,
  FilterIcon,
  MoveUpRight,
  Plus,
  SearchIcon,
} from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { neuroscienceFields } from "@/app/(Frond-End)/mu/(muGroup)/neuroscience-network/_mock/neuroscienceData";
import { spawn } from "child_process";
import AddUniversity from "./AddUniversity";
import EditUniversity from "./EditUniversity";
import {
  useDeleteUniversityMutation,
  useGetAllStateQuery,
  useGetUniversityQuery,
} from "@/feature/slice/admin/academia/UniversitySlice";
import Pagination from "@/components/reusable/Pagination";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

interface UniversityQueryParams {
  search?: string;
  state_id?: string;
  per_page?: number;
  page?: number;
}

type Job = {
  id: number;
  university_name: string;
  state: string;
  psychology_degrees: string[];
  counseling_degrees: string[];
  neuroscience_degrees: string[];
  map_pin: {
    latitude: string;
    longitude: string;
  } | null;
  website: string;
  phone: string | null;
  location: string | null;
};

export default function Universites() {
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data: university } = useGetUniversityQuery({
    search,
    state_id: stateId,
    per_page: perPage,
    page,
  });

  const universityData = university?.data ?? [];

  const [deleteUniversityData, { isLoading: isDeleting }] =
    useDeleteUniversityMutation();

  const { data: statesData } = useGetAllStateQuery({});
  const states = statesData?.data ?? [];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sort, setSort] = useState("default");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const openView = (job: Job) => {
    setSelectedJob(job);
    setViewOpen(true);
  };

  const openEdit = (job: Job) => {
    setSelectedJob(job);
    setEditOpen(true);
  };

  const openDelete = (job: Job) => {
    setSelectedJob(job);
    setDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedJob) return;

    try {
      await deleteUniversityData(selectedJob.id).unwrap();

      setDeleteOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Failed to delete university:", error);
    }
  };
  const columns: Column<Job>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="overflow-hidden text-[#0A0A0A] text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.id}
        </span>
      ),
    },
    {
      header: "University",
      accessor: "university_name",
      cell: (row) => (
        <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.university_name}
        </span>
      ),
    },
    {
      header: "State",
      accessor: "state",
      cell: (row) => <CustomBadge color="gray">{row.state}</CustomBadge>,
    },

    {
      header: "Psychology Degrees",
      accessor: "psychology_degrees",
      cell: (row) => (
        <div className="flex gap-2">
          {row.psychology_degrees?.length ? (
            row.psychology_degrees.map((degree, index) => (
              <CustomBadge
                key={index}
                color="green"
                className="text-[14px] font-normal text-[#0A0A0A]"
              >
                {degree}
              </CustomBadge>
            ))
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      ),
    },

    {
      header: "Counseling Degrees",
      accessor: "counseling_degrees",
      cell: (row: any) => {
        return (
          <div className="flex gap-2">
            {row.counseling_degrees?.length ? (
              row.counseling_degrees.map((degree, index) => (
                <CustomBadge
                  key={index}
                  color="yellow"
                  className="text-[14px] font-normal text-[#0A0A0A]"
                >
                  {degree}
                </CustomBadge>
              ))
            ) : (
              <span className="text-sm text-gray-500">N/A</span>
            )}
          </div>
        );
      },
    },

    {
      header: "Neuroscience Degrees",
      accessor: "neuroscience_degrees",
      cell: (row: any) => {
        return (
          <div className="flex gap-2">
            {row.neuroscience_degrees?.length ? (
              row.neuroscience_degrees.map((degree, index) => (
                <CustomBadge
                  key={index}
                  color="red"
                  className="text-[14px] font-normal text-[#0A0A0A]"
                >
                  {degree}
                </CustomBadge>
              ))
            ) : (
              <span className="text-sm text-gray-500">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Map Pin (Lat,Long)",
      accessor: "map_pin",
      cell: (row) => (
        <span className="text-[#006EFF] text-xs font-semibold">
          {row.map_pin
            ? `${row.map_pin.latitude}, ${row.map_pin.longitude}`
            : "N/A"}
        </span>
      ),
    },

    {
      header: "Website",
      accessor: "website",
      cell: (row) => (
        <a
          href={
            row.website
              ? row.website.startsWith("http")
                ? row.website
                : `https://${row.website}`
              : `https://www.google.com/search?q=${encodeURIComponent(
                  row.university_name || "",
                )}`
          }
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 text-[#006EFF] items-center ext-[#006EFF] text-right  text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer"
        >
          <MoveUpRight className="h-5 w-5" /> visit
        </a>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row xl:items-center">
        {/* Title */}
        <div className="mb-0 lg:mb-6  w-full">
          <CustomTitleDescription
            title="Manage Universities"
            description="Showing 1-20 of 1697 Records"
          />
        </div>

        {/* Actions */}
        <div className="mb-6 flex w-full justify-end">
          <div className="flex w-full flex-col md:flex-row items-start gap-4 lg:w-auto lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative w-full md:w-[220px]">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

              <input
                className="h-10 w-full rounded-md border p-2 pl-7"
                type="text"
                placeholder="Search University Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Sort */}
            <div className="w-full md:w-[170px]">
              <CustomSelect
                value={stateId || "default"}
                onChange={(value) => {
                  setStateId(value === "default" ? "" : String(value));
                  setPage(1);
                }}
                options={[
                  {
                    label: "Filter by state",
                    value: "default",
                  },
                  ...states.map((st: any) => ({
                    label: st.name,
                    value: String(st.id),
                  })),
                ]}
                placeholder="Filter by state"
                className="h-10 w-full lg:w-[170px]"
              />
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add New University
            </button>
          </div>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={universityData}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        <Pagination
          page={page}
          pageSize={university?.pagination?.per_page ?? 10}
          total={university?.pagination?.total ?? 0}
          totalPages={university?.pagination?.last_page ?? 0}
          onPageChange={setPage}
          showPageSize
          onPageSizeChange={(size) => {
            setPerPage(size);
            setPage(1);
          }}
        />
        {/* //add university */}
        <CustomModal
          open={addOpen}
          onOpenChange={setAddOpen}
          title="Add New University"
          size="lg"
        >
          <AddUniversity onClose={() => setAddOpen(false)} />
        </CustomModal>

        {/* Edit Job */}
        <CustomModal
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit University"
          size="lg"
        >
          {selectedJob && (
            <EditUniversity
              onClose={() => setEditOpen(false)}
              data={selectedJob}
            />
          )}
        </CustomModal>

        {/* Delete Job */}
        <CustomDeletModal
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedJob(null);
          }}
          onConfirm={handleDeleteUser}
          title="Do you want to delete this user?"
          description="Click “Delete Now” if you want to delete otherwise press cancel."
        />
      </div>
    </div>
  );
}
