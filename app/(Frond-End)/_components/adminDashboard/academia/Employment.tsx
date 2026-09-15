"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, Plus, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AddEmployment from "./EmploymentAddModal";
import UpdateEmployment from "./EmploymentUpdate";
import {
  useDeleteEmploymentMutation,
  useGetEmploymentQuery,
} from "@/feature/slice/admin/academia/EmploymentSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import Pagination from "@/components/reusable/Pagination";
import toast from "react-hot-toast";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

type Job = {
  id: number;
  state?: string | { id: number; name: string };
  state_id?: number;
  category?: string;
  mapPin?: string;
  map_pin?: {
    latitude: string;
    longitude: string;
  } | null;
  title?: string;
  jobtitle?: string;
  city?: string;
  location?: string;
  companyName?: string;
  company_name?: string;
  typemode?: string[];
  employment_type?: string;
  job_mode?: string;
  salary_range?: string;
  salary_min?: string | number;
  salary_max?: string | number;
};

export default function Employment() {
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("default");

  const { data: employmentResponse, isLoading } = useGetEmploymentQuery({
    search,
    state_id: stateId === "default" || stateId === "all" ? "" : stateId,
    per_page: perPage,
    page,
  });

  const { data: statesData } = useGetAllStateQuery({});
  const states = statesData?.data ?? [];

  const jobs: Job[] = employmentResponse?.data ?? [];

  const [deleteEmploymentData, { isLoading: isDeleting }] =
    useDeleteEmploymentMutation();

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const openAdd = () => {
    setSelectedJob(null);
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
      await deleteEmploymentData(selectedJob.id).unwrap();
      toast.success("Job deleted successfully");
      setDeleteOpen(false);
      setSelectedJob(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete job");
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
      header: "Job Title ",
      accessor: "title" as any,
      cell: (row) => (
        <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.title || row.jobtitle || "-"}
        </span>
      ),
    },
    {
      header: "Company Name ",
      accessor: "company_name" as any,
      cell: (row) => (
        <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.company_name || row.companyName || "-"}
        </span>
      ),
    },
    {
      header: "State",
      accessor: "state" as any,
      cell: (row) => {
        const stateName =
          typeof row.state === "object" ? row.state?.name : row.state || "-";
        return <CustomBadge color="gray">{stateName}</CustomBadge>;
      },
    },
    {
      header: "City",
      accessor: "location" as any,
      cell: (row) => (
        <CustomBadge color="yellow">
          <p className="text-nowrap"> {row.location || row.city || "-"}</p>
        </CustomBadge>
      ),
    },
    {
      header: "Category",
      accessor: "category" as any,
      cell: (row) => {
        const cat = row.category || "";
        const isOrange =
          cat === "State Institution" || cat === "state_institution";
        const isBlue =
          cat === "University Hospital" || cat === "university_hospital";
        const label =
          cat === "state_institution"
            ? "State Institution"
            : cat === "private_practice"
              ? "Private Practice"
              : cat || "-";
        return (
          <CustomBadge color={isOrange ? "orange" : isBlue ? "blue" : "green"}>
            <p className="text-nowrap"> {label}</p>
          </CustomBadge>
        );
      },
    },
    {
      header: "Type and Mode",
      cell: (row) => {
        const modes = Array.isArray(row.typemode)
          ? row.typemode
          : [row.employment_type, row.job_mode].filter(Boolean);
        return (
          <div className="flex gap-2 flex-wrap">
            {modes.length > 0 ? (
              modes.map((mode, index) => (
                <CustomBadge key={index} color="blue">
                  {mode}
                </CustomBadge>
              ))
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Salary Range",
      accessor: "salary_min" as any,
      cell: (row) => {
        return (
          <span className="flex items-center gap-2 overflow-hidden text-primaryColor text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
            {row.salary_range}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row md:items-center">
        {/* Title */}
        <div className="mb-0 lg:mb-6  w-full">
          <CustomTitleDescription
            title="Manage Job Openings"
            description={`Showing 1-${jobs.length} of ${employmentResponse?.pagination?.total ?? jobs.length} Programs`}
          />
        </div>

        {/* Actions */}
        <div className="mb-6 flex w-full justify-start xl:justify-end">
          <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
            {/* Search */}
            <div className="relative w-full md:w-[220px]">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

              <input
                className="h-10 w-full rounded-md border p-2 pl-7"
                type="text"
                placeholder="Search Job Title"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filter by state */}
            <div className=" w-full lg:w-[170px]">
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
              onClick={openAdd}
              className="flex w-full cursor-pointer text-nowrap items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add New Job
            </button>
          </div>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={jobs}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        <Pagination
          page={page}
          pageSize={perPage}
          total={employmentResponse?.pagination?.total ?? 0}
          totalPages={employmentResponse?.pagination?.last_page ?? 0}
          onPageChange={setPage}
          showPageSize
          onPageSizeChange={(size) => {
            setPerPage(size);
            setPage(1);
          }}
        />

        {/* Add Job Details */}
        <CustomModal
          open={viewOpen}
          onOpenChange={setViewOpen}
          title="Add New Job"
          size="lg"
        >
          <AddEmployment onClose={() => setViewOpen(false)} />
        </CustomModal>

        {/* Edit Job */}
        <CustomModal
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Job"
          size="lg"
        >
          {selectedJob && (
            <div className="p-4">
              <UpdateEmployment
                onClose={() => setEditOpen(false)}
                data={selectedJob}
              />
            </div>
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
          title="Do you want to delete this job?"
          description="Click “Delete Now” if you want to delete otherwise press cancel."
        />
      </div>
    </div>
  );
}
