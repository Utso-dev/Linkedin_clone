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
import {
  FilterIcon,
  MapPin,
  MoveUpRight,
  Phone,
  Plus,
  SearchIcon,
} from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import FacilityForm from "./FacilitiesModal";
import {
  useDeleteFacilitiesMutation,
  useGetAllFacilitiesQuery,
} from "@/feature/slice/admin/academia/FacilitesSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import Pagination from "@/components/reusable/Pagination";
import toast from "react-hot-toast";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

type FacilityItem = {
  id: number;
  name?: string;
  facility_details?: {
    name?: string;

    location?: string;
    phone?: string;
  };
  facility_name?: string;
  programName?: string;
  program_name?: string;
  state?: string | { id: number; name: string };
  state_id?: number;
  category?: string;
  type?: string;
  location?: string;
  city?: string;
  map_pin?: {
    latitude: string;
    longitude: string;
  } | null;
  mapPin?: string;
  latitude?: string | number;
  longitude?: string | number;
  website?: string;
  phone?: string | null;
  phoneNumber?: string | null;
};

export default function Facilites() {
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("default");

  const { data: facilitiesResponse, isLoading } = useGetAllFacilitiesQuery({
    search,
    state_id: stateId === "default" || stateId === "all" ? "" : stateId,
    per_page: perPage,
    page,
  });

  const { data: statesData } = useGetAllStateQuery({});
  const states = statesData?.data ?? [];

  const facilitiesData: FacilityItem[] = facilitiesResponse?.data ?? [];

  const [deleteFacilitiesData, { isLoading: isDeleting }] =
    useDeleteFacilitiesMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FacilityItem | null>(null);

  const openAdd = () => {
    setSelectedJob(null);
    setAddOpen(true);
  };

  const openEdit = (job: FacilityItem) => {
    setSelectedJob(job);
    setEditOpen(true);
  };

  const openDelete = (job: FacilityItem) => {
    setSelectedJob(job);
    setDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedJob) return;

    try {
      await deleteFacilitiesData(selectedJob.id).unwrap();
      toast.success("Facility deleted successfully");
      setDeleteOpen(false);
      setSelectedJob(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete facility");
    }
  };

  const columns: Column<FacilityItem>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="overflow-hidden text-[#0A0A0A] text-ellipsis  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.id}
        </span>
      ),
    },
    {
      header: "Facilities Details",
      accessor: "facility_details" as any,
      cell: (row) => (
        <div>
          <p className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
            {row.facility_details?.name || "-"}
          </p>
          <div className="flex gap-6 items-center">
            <p className="flex gap-2 justify-center items-center">
              <MapPin className="h-3 w-3" />
              {row.facility_details?.location || "-"}
            </p>
            <p className="flex gap-2 justify-center items-center">
              <Phone className="h-3 w-3" />
              {row.facility_details?.phone || "-"}
            </p>
          </div>
        </div>
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
      header: "Category",
      accessor: "category" as any,
      cell: (row) => {
        const cat = row.category || row.type || "";
        const isOrange =
          cat === "State Institution" || cat === "state_institution";
        const isBlue =
          cat === "University Hospital" || cat === "university_hospital";
        const label =
          cat === "state_institution"
            ? "State Institution"
            : cat === "university_hospital"
              ? "University Hospital"
              : cat === "va_facility"
                ? "VA Facility"
                : cat || "Facility";
        return (
          <CustomBadge color={isOrange ? "orange" : isBlue ? "blue" : "green"}>
            <p className=" text-nowrap">{label}</p>
          </CustomBadge>
        );
      },
    },
    {
      header: "Map Pin (Lat,Long)",
      cell: (row) => {
        const coordinates = row.map_pin
          ? `${row.map_pin.latitude}, ${row.map_pin.longitude}`
          : row.latitude && row.longitude
            ? `${row.latitude}, ${row.longitude}`
            : row.mapPin || "-";
        return (
          <span className="text-[#006EFF] text-right  text-xs font-semibold leading-[132%] tracking-[0.06px]">
            {coordinates}
          </span>
        );
      },
    },
    {
      header: "Website",
      accessor: "website" as any,
      cell: (row) => (
        <a
          href={
            row.website
              ? row.website.startsWith("http")
                ? row.website
                : `https://${row.website}`
              : `https://www.google.com/search?q=${encodeURIComponent(
                  row.name || row.facility_name || row.programName || "",
                )}`
          }
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 text-[#006EFF] items-center ext-[#006EFF] text-right  text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer"
        >
          <MoveUpRight className="h-5 w-5" /> Visit
        </a>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-col lg:flex-row md:items-center">
        {/* Title */}
        <div className="mb-0 lg:mb-6  w-full">
          <CustomTitleDescription
            title="Hospitals & Facilities"
            // description={`Showing 1-${facilitiesData.length} of ${facilitiesResponse?.pagination?.total ?? facilitiesData.length} Programs`}
          />
        </div>

        {/* Actions */}
        <div className="mb-6 flex w-full justify-end">
          <div className="flex w-full flex-col items-start gap-4 sm:w-full lg:w-auto lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative w-full lg:w-[220px]">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

              <input
                className="h-10 w-full rounded-md border p-2 pl-7"
                type="text"
                placeholder="Search Facility Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filter by state */}
            <div className="w-full lg:w-[170px]">
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
              className="flex lg:w-auto w-full  cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white text-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add New Facilities
            </button>
          </div>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={facilitiesData}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        <Pagination
          page={page}
          pageSize={perPage}
          total={facilitiesResponse?.pagination?.total ?? 0}
          totalPages={facilitiesResponse?.pagination?.last_page ?? 0}
          onPageChange={setPage}
          showPageSize
          onPageSizeChange={(size) => {
            setPerPage(size);
            setPage(1);
          }}
        />

        {/* Add Facility Modal */}
        <CustomModal
          open={addOpen}
          onOpenChange={setAddOpen}
          title="Add New Facility"
          size="lg"
        >
          <FacilityForm mode="add" onClose={() => setAddOpen(false)} />
        </CustomModal>

        {/* Edit Facility Modal */}
        <CustomModal
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Facility"
          size="lg"
        >
          {selectedJob && (
            <FacilityForm
              mode="edit"
              onClose={() => setEditOpen(false)}
              initialData={{
                id: selectedJob.id,
                facilityName: selectedJob.facility_details?.name || "",
                state:
                  typeof selectedJob.state === "object"
                    ? selectedJob.state.name
                    : selectedJob.state || "",
                type: selectedJob.category || "",
                city: selectedJob.facility_details?.location || "",
                latitude: selectedJob.map_pin?.latitude
                  ? String(selectedJob.map_pin.latitude)
                  : "",
                longitude: selectedJob.map_pin?.longitude
                  ? String(selectedJob.map_pin.longitude)
                  : "",
                phoneNumber: selectedJob.facility_details?.phone || "",
                website: selectedJob.website || "",
              }}
            />
          )}
        </CustomModal>

        {/* Delete Facility */}
        <CustomDeletModal
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedJob(null);
          }}
          onConfirm={handleDeleteUser}
          title="Do you want to delete this facility?"
          description="Click “Delete Now” if you want to delete otherwise press cancel."
        />
      </div>
    </div>
  );
}
