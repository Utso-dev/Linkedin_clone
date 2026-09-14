"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";

import { useState } from "react";
import { ArrowDownToLine, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import EditOverModal from "./EditOverModal";
import { useGetMySubscribersQuery, useCancelSubscriptionMutation, useGetPlansQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import { Plan, Subscription } from "@/feature/slice/admin/subscription/subscriptionType";
import { formatDate } from "date-fns";

type Job = {
    id: number;
    img: string;
    Subscribers: string;
    plan: string;
    billingCycle: string;
    nextBilling: string;
    amount: string;
    stayday: string;
    status: string;
    joined: string;
};

export default function OverViewTable() {
    const [page, setPage] = useState(1);
    const [planFilter, setPlanFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [search, setSearch] = useState("");

    const queryParams: Record<string, unknown> = { page, per_page: 10 };
    if (planFilter) queryParams.plan_id = planFilter;
    if (statusFilter) queryParams.status = statusFilter;
    if (date?.from) queryParams.date_from = date.from.toISOString().split("T")[0];
    if (date?.to) queryParams.date_to = date.to.toISOString().split("T")[0];
    if (search.trim()) queryParams.search = search.trim();

    const { data: apiResponse, isLoading, isError } = useGetMySubscribersQuery({ query: queryParams });

    const [cancelSubscription] = useCancelSubscriptionMutation();

    const {data: planData, isLoading: isPlanLoading, isError: isPlanError} = useGetPlansQuery();

    const planOptions = planData?.data?.map((plan: Plan) => ({
        label: plan.name,
        value: plan.id,
    })) || [];

    const mapSubscriptionToJob = (sub: Subscription): Job => ({
        id: sub.id,
        img: sub.subscriber?.image || userIcon.src,
        Subscribers: sub.subscriber?.name || "Unknown",
        plan: sub.plan?.name || "-",
        billingCycle: sub.billing_cycle,
        nextBilling: sub.next_billing_date,
        amount: sub.plan?.amount || "$0",
        stayday: sub.days_left > 0 ? `In ${sub.days_left} days` : sub.status === "active" ? "In 0 days" : "Expired",
        status: sub.status === "active" ? "Active" : "Suspended",
        joined: sub.joined_at,
    });

    const jobs: Job[] = apiResponse?.data?.map(mapSubscriptionToJob) ?? [];

    const totalSubscribers = apiResponse?.data?.length ?? 0;

 

    const openDelete = (job: Job) => {
        setSelectedJob(job);
        setDeleteOpen(true);
    };

    const handleDeleteUser = async () => {
        if (selectedJob) {
            try {
                await cancelSubscription({ id: selectedJob.id }).unwrap();
                setDeleteOpen(false);
                setSelectedJob(null);
            } catch (error) {
                console.error("Failed to cancel subscription:", error);
            }
        }
    };

    const columns: Column<Job>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="text-gray-500">{row.id}</span>
            ),
        },
        {
            header: "Subscribers",
            accessor: "Subscribers",
            cell: (row) => (
                <span className="flex items-center gap-2 overflow-hidden text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {row.img && (
                        <Image
                            src={row.img}
                            alt={row.Subscribers}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )}
                    {row.Subscribers}
                </span>
            ),
        },
        {
            header: "Plan",
            accessor: "plan",
            cell: (row) => (
                <CustomBadge color={row.plan === "Premium" ? "orange" : row.plan === "Basic" ? "purple" : row.plan === "Pro industry" ? "green" : "gray"} className="font-medium">
                    {row.plan}
                </CustomBadge>
            ),
        },
        {
            header: "Status",
            cell: (row) => (
                row.status === "Active" ? (
                    <CustomBadge color="active">{row.status}</CustomBadge>
                ) : (
                    <CustomBadge color="suspended">{row.status}</CustomBadge>
                )
            ),
        },
        {
            header: "Billing Cycle",
            cell: (row) => (
                <span className=" overflow-hidden text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {row.billingCycle}
                </span>
            ),
        },

        {
            header: "Next Billing",
            cell: (row) => (
                <div className="flex flex-col gap-2">
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                        {formatDate(new Date(row.nextBilling), "dd MMM yyyy")}
                    </span>
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                        {row.stayday}
                    </span>
                </div>
            ),
        },
        {
            header: "Amount",
            cell: (row) => (
                <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {row.amount} <span className="text-[#0A0A0A80]"> /year</span>
                </span>
            ),
        },


        {
            header: "Joined",
            cell: (row) => (
                <span className="text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {formatDate(new Date(row.joined), "dd MMM yyyy")    }
                </span>
            ),
        },

        {
            header: "Action",
            cell: (row) => (
                <span className="text-ellipsis text-[#0A0A0A] font-['Segoe_UI'] text-sm font-semibold leading-[140%] tracking-[0.07px]">
                    <button onClick={() => openDelete(row)} className="flex items-center justify-center gap-2 rounded-md bg-red-500/80 hover:bg-red-500/90 cursor-pointer px-3 py-1.5 text-white ">
                        Cancel
                    </button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row md:items-center">
                {/* Title */}
                <div className="mb-6  w-full">
                    <CustomTitleDescription
                        title="Overview"
                        description={`${totalSubscribers} Premium Users`}
                    />
                </div>

                {/* Actions */}
                <div className="mb-6 flex w-full justify-end">
                    <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:flex-row lg:items-center">

                        {/* Export */}


                        {/* Search */}
                        <div className="relative w-full min-w-48">
                            <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

                            <input
                                className="h-10 w-full rounded-md border p-2 pl-7"
                                type="text"
                                placeholder="Search by user name, email or plan..."
                            />
                        </div>

                        <CustomSelect
                            className=" h-[38px] text-nowrap"
                            value={planFilter || "default"}
                            onChange={(value: string) =>
                                setPlanFilter(value === "default" ? "" : value)
                            }
                            options={planOptions}
                        />

                        <CustomSelect
                            value={statusFilter || "default"}
                            className=" h-[38px] text-nowrap"
                            onChange={(value: string) =>
                                setStatusFilter(value === "default" ? "" : value)
                            }
                            options={[
                                {
                                    label: "All Status",
                                    value: "default",
                                },
                                {
                                    label: "Active",
                                    value: "active",
                                },
                                {
                                    label: "Suspended",
                                    value: "cancelled",
                                },
                            ]}
                        />

                        <DateRangePicker className=" h-[38px]" date={date} setDate={setDate} placeholder='Select date range' />

                        {/* <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto">
                            <ArrowDownToLine className="h-4 w-4" />
                            Export
                        </button> */}
                    </div>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={jobs}
                />

                {/* View Job Details */}
                <CustomModal
                    open={viewOpen}
                    onOpenChange={setViewOpen}
                    showCloseButton={false}
                    size="lg"
                >
                    <div>

                    </div>
                </CustomModal>

                {/* Edit Job */}
                <CustomModal
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    title="OverView"
                    size="lg"
                >
                    {/* {selectedJob && (
                        <div className="p-6">
                            Edit content here for {selectedJob.Subscribers}
                        </div>
                    )} */}

                    <EditOverModal

                        data={selectedJob}
                        onClose={() => setEditOpen(false)}
                    />
                </CustomModal>

                {/* Delete Job */}
                <CustomDeletModal
                    isOpen={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteUser}
                    title="Do you want to cancel this subscription?"
                    description="Click “Cancel Now” if you want to cancel otherwise press cancel."
                    confirmText="Cancel Now"
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
}