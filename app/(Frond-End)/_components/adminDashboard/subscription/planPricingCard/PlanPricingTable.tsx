"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { useMemo, useState } from "react";
import { ArrowDownToLine, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import { useDeactivePlanMutation, useGetPlansQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import { Plan } from "@/feature/slice/admin/subscription/subscriptionType";
import CreatePlan from "./CreatePlan";
import toast from "react-hot-toast";

const getPlanBadgeColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("premium") || n.includes("professional")) return "orange" as const;
    if (n.includes("basic") || n.includes("free")) return "purple" as const;
    if (n.includes("pro") || n.includes("industry")) return "green" as const;
    return "gray" as const;
};

const formatRate = (rate: string) => {
    if (!rate) return "$0";
    return rate.trim().startsWith("$") ? rate : `$${rate}`;
};

export default function PlanPricingTable() {
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [deactiveOpen, setDeactiveOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const { data: apiResponse, isLoading, isError } = useGetPlansQuery();
    const [deactivePlan] = useDeactivePlanMutation();

    const plans = apiResponse?.data ?? [];

    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => {
            const q = search.trim().toLowerCase();
            const matchesSearch =
                !q ||
                plan.name.toLowerCase().includes(q) ||
                plan.short_description.toLowerCase().includes(q);

            const matchesPlan = !planFilter || plan.name === planFilter;
            const matchesStatus = !statusFilter || plan.status === statusFilter;

            const createdAt = plan.created_at ? new Date(plan.created_at) : null;
            const matchesDate =
                !date?.from ||
                (createdAt &&
                    createdAt >= date.from &&
                    createdAt <= (date.to ?? date.from));

            return matchesSearch && matchesPlan && matchesStatus && matchesDate;
        });
    }, [plans, search, planFilter, statusFilter, date]);

    const planOptions = useMemo(() => {
        const names = Array.from(new Set(plans.map((plan) => plan.name).filter(Boolean)));
        return [
            { label: "All Plans", value: "default" },
            ...names.map((name) => ({ label: name, value: name })),
        ];
    }, [plans]);

    const openDelete = (row: Plan) => {
        setSelectedPlan(row);
        setDeactiveOpen(true);
    };

    const openEdit = (row: Plan) => {
        setSelectedPlan(row);
        setEditOpen(true);
    };

    const handleDeactive = async () => {
        if (!selectedPlan) return;
        try {
            await deactivePlan({ id: selectedPlan.id }).unwrap();
            toast.success(selectedPlan?.status === "active" ? "Plan deactivated successfully." : "Plan activated successfully.");
            setDeactiveOpen(false);
            setSelectedPlan(null);
        } catch {
            toast.error(selectedPlan?.status === "active" ? "Failed to deactive this plan." : "Failed to activate this plan.");
        }
    };

    const columns: Column<Plan>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="text-gray-500">
                    {filteredPlans.findIndex((plan) => plan.id === row.id) + 1}
                </span>
            ),
        },
        {
            header: "Description",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-normal text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">
                        {row.short_description}
                    </span>
                </div>
            ),
        },
        {
            header: "Plan",
            cell: (row) => (
                <CustomBadge color={getPlanBadgeColor(row.name)} className="font-medium">
                    {row.name}
                </CustomBadge>
            ),
        },
        {
            header: "Status",
            cell: (row) =>
                row.status === "active" ? (
                    <CustomBadge color="active">Active</CustomBadge>
                ) : (
                    <CustomBadge color="suspended">Inactive</CustomBadge>
                ),
        },
        {
            header: "Amount",
            cell: (row) => (
                <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">
                    {formatRate(row.billing_rate)}
                    <span className="text-[14px] text-[#777980]">
                        / {row.billing_cycle === "yearly" ? "year" : "month"}
                    </span>
                </span>
            ),
        },
        {
            header: "Subscribers",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">
                        {row.subscribers ?? "-"}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div>

            <h2 className="text-2xl font-bold">Plan Pricing</h2>
            <p className="text-sm text-gray-500 mb-4">Manage your subscription plans and pricing.</p>
            {/* Filters */}
            {/* <div className="flex w-full justify-start lg:justify-end">
                <div className="mb-6 flex flex-col w-full lg:w-full xl:w-2/3 lg:flex-row items-center justify-start gap-4 ">
                    <div className="relative w-full  xl:w-[300px]">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full xl:w-[300px] rounded-md border border-gray-200 bg-white p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primaryColor"
                            type="text"
                            placeholder="Search by plan name or description..."
                        />
                    </div>

                    <CustomSelect
                        className="h-[38px]"
                        value={planFilter || "default"}
                        onChange={(value: string | number) =>
                            setPlanFilter(value === "default" ? "" : String(value))
                        }
                        options={planOptions}
                    />

                    <CustomSelect
                        className="h-[38px] "
                        value={statusFilter || "default"}
                        onChange={(value: string | number) =>
                            setStatusFilter(value === "default" ? "" : String(value))
                        }
                        options={[
                            { label: "All Status", value: "default" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ]}
                    />

                    <DateRangePicker
                        className="h-[38px] "
                        date={date}
                        setDate={setDate}
                        placeholder="Select Date Range"
                    />

                    <button className="flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 text-white transition hover:bg-[#038a9c]">
                        <ArrowDownToLine className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div> */}

            {isLoading ? (
                <p className="py-12 text-center text-sm text-gray-400">Loading plans...</p>
            ) : isError ? (
                <p className="py-12 text-center text-sm text-red-500">Failed to load plans.</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredPlans}
                    onDelete={openDelete}
                    onEdit={openEdit}
                />
            )}

            <CustomModal
                open={editOpen}
                onOpenChange={setEditOpen}
                size="lg"
                showCloseButton={false}
            >
                <CreatePlan
                    key={selectedPlan?.id}
                    data={selectedPlan}
                    onClose={() => {
                        setEditOpen(false);
                        setSelectedPlan(null);
                    }}
                />
            </CustomModal>

            <CustomDeletModal
                isOpen={deactiveOpen}
                onClose={() => setDeactiveOpen(false)}
                onConfirm={handleDeactive}
                title="Do you want to deactive this plan?"
                description='Click “Deactive Now” if you want to deactive otherwise press cancel.'
                confirmText={selectedPlan?.status === "active" ? "Deactive Now" : "Activate Now"}
                
            />
        </div>
    );
}
