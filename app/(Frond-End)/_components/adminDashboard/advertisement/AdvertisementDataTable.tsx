"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";
import advertise from "@/public/images/admin/advertise1.png";

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
  Plus,
  SearchIcon,
} from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import AdvertisementViewDetails from "./AdvertisementViewDetails";
import EditvertisementEditForm from "./EditAdvertiseData";
import AdvertisementEditForm from "./AddAdvertisement";

type Job = {
  id: number;
  img: string;
  advertisImage: string;
  title: string;
  desc: string;
  advertiser: string;
  industry: string;
  impression: string;
  clicks: string;
  ctr: string;
  status: string;
  joined: string;
};

const initialJobs: Job[] = [
  {
    id: 1,
    img: userIcon.src,
    advertisImage: advertise.src,
    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Psychotropic",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 2,
    img: userIcon.src,
    advertisImage: advertise.src,

    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Publication",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 3,
    img: userIcon.src,
    advertisImage: advertise.src,

    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Psychotropic",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Suspended",
    joined: "2024-01-15",
  },
  {
    id: 4,
    img: userIcon.src,
    advertisImage: advertise.src,

    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Biotech",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Suspended",
    joined: "2024-01-15",
  },
  {
    id: 5,
    img: userIcon.src,
    advertisImage: advertise.src,

    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Psychotropic",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 6,
    img: userIcon.src,
    advertisImage: advertise.src,

    title: "Welcome to Mind Unite",
    desc: "welcome-to-mind-unite",
    advertiser: "Clinical Psychologist",
    industry: "Publication",
    impression: "45,675",
    clicks: "6,864",
    ctr: "15.0%",
    status: "Active",
    joined: "2024-01-15",
  },
];

export default function AdvertisementTable() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sort, setSort] = useState("default");
  const [addOpen, setAddOpen] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>(undefined);
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

  const handleDeleteUser = () => {
    if (selectedJob) {
      setJobs((prevJobs) =>
        prevJobs.filter((item) => item.id !== selectedJob.id),
      );
      console.log(`Deleted user with ID: ${selectedJob.id}`);
      setDeleteOpen(false);
      setSelectedJob(null);
    }
  };

  const columns: Column<Job>[] = [
    {
      header: "No.",
      cell: (row) => <span className="text-gray-500">{row.id}</span>,
    },
    {
      header: "Ad Details",
      cell: (row) => (
        <span className="flex items-center gap-2 overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.advertisImage && (
            <Image
              src={row.advertisImage}
              alt={row.advertiser}
              width={100}
              height={56}
              className="rounded-none"
            />
          )}
          <div className="flex flex-col">
            {row.title}
            <p className="text-[#828282] text-[14px] font-normal leading-[140%] tracking-[0.07px] truncate">
              {row.desc}
            </p>
          </div>
        </span>
      ),
    },
    {
      header: "Advertiser",
      accessor: "advertiser",
      cell: (row) => (
        <span className="flex items-center gap-2 overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.img && (
            <Image
              src={row.img}
              alt={row.advertiser}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          {row.advertiser}
        </span>
      ),
    },
    {
      header: "Industry",
      accessor: "industry",
      cell: (row) => (
        <CustomBadge
          color={
            row.industry === "Biotech"
              ? "orange"
              : row.industry === "Publication"
                ? "purple"
                : row.industry === "Psychotropic"
                  ? "green"
                  : "gray"
          }
          className="font-medium"
        >
          {row.industry}
        </CustomBadge>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        row.status === "Active" ? (
          <CustomBadge color="active">{row.status}</CustomBadge>
        ) : (
          <CustomBadge color="suspended">{row.status}</CustomBadge>
        ),
    },
    {
      header: "Impression",
      cell: (row) => (
        <span className=" overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.impression}
        </span>
      ),
    },
    {
      header: "Clicks",
      cell: (row) => (
        <span className=" overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.clicks}
        </span>
      ),
    },
    {
      header: "CTR",
      cell: (row) => (
        <span className=" overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
          {row.ctr}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row md:items-center">
        {/* Title */}
        {/* <div className="mb-6  w-full">
                    <CustomTitleDescription
                        title="overview"
                        description="8,560 Premium Users"
                    />
                </div> */}

        {/* Actions */}
        <div className="mb-4 flex w-full justify-end">
          <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:flex-row lg:items-center">
            {/* Export */}

            {/* Search */}
            <div className="relative w-full w-auto">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

              <input
                className="h-10 w-full rounded-md border p-2 pl-7"
                type="text"
                placeholder="Search by user name, email or plan..."
              />
            </div>

            <CustomSelect
              className=" h-[38px]"
              value={sort}
              onChange={(value: string) =>
                setSort(value === "default" ? "" : value)
              }
              options={[
                {
                  label: "All Plans",
                  value: "default",
                },
                {
                  label: "Premium",
                  value: "Premium",
                },
                {
                  label: "Basic",
                  value: "Basic",
                },
                {
                  label: "Pro Industry",
                  value: "Pro Industry",
                },
              ]}
            />

            <CustomSelect
              value={sort}
              className=" h-[38px]"
              onChange={(value: string) =>
                setSort(value === "All Status" ? "" : value)
              }
              options={[
                {
                  label: "All Status",
                  value: "default",
                },
                {
                  label: "Suspended",
                  value: "suspended",
                },
              ]}
            />
            <DateRangePicker
              className=" h-[38px]"
              date={date}
              setDate={setDate}
              placeholder="Select date range"
            />
            <button
              onClick={() => {
                setAddOpen(true);
                setSelectedJob(null);
              }}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto">
              <ArrowDownToLine className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={jobs}
          // defaultPageSize={10}
          onView={openView}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {/* View Job Details */}
        <CustomModal
          open={viewOpen}
          onOpenChange={setViewOpen}
          showCloseButton={false}
          title="View Advertisement"
          size="sm"
        >
          <div>
            <AdvertisementViewDetails job={selectedJob} />
          </div>
        </CustomModal>

        {/* Edit Job */}
        <CustomModal
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Advertisement"
          size="sm"
        >
          <EditvertisementEditForm
            job={selectedJob}
            onCancel={() => setEditOpen(false)}
            onUpdate={() => {
              console.log("Updated");
              setEditOpen(false);
            }}
          />
        </CustomModal>

        {/* Delete Job */}
        <CustomDeletModal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteUser}
          title="Do you want to delete this user?"
          description="Click “Delete Now” if you want to delete otherwise press cancel."
        />

        <CustomModal
          open={addOpen}
          onOpenChange={setAddOpen}
          title="Add Advertisement"
          size="lg"
        >
          <AdvertisementEditForm
            job={null}
            onCancel={() => setAddOpen(false)}
            onUpdate={() => {
              console.log("Created new advertisement");
              setAddOpen(false);
            }}
          />
        </CustomModal>
      </div>
    </div>
  );
}
