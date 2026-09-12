"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";
import visaIcon from "@/public/images/admin/visa.png";
import mastercardIcon from "@/public/images/admin/paypal.png";
import americanExpressIcon from "@/public/images/admin/american.png";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Copy, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import EditTransactionForm from "./EditTransactionForm";
import Pagination from "@/components/reusable/Pagination";
import { useGetPlansQuery, useGetTransactionListQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import { Transaction as ApiTransaction, Plan } from "@/feature/slice/admin/subscription/subscriptionType";

type Transaction = {
    id: number;
    transactionId: string;
    img: string;
    subscriber: string;
    plan: string;
    amount: string;
    status: "Completed" | "Failed" | "Refunded" | "Pending";
    paymentMethod: string;
    cardNumber: string;
    date: string;
    time: string;
};

const mapCardBrand = (brand: string) => {
    const normalized = brand?.toLowerCase();
    if (normalized === "visa") return "VISA";
    if (normalized === "mastercard" || normalized === "master_card" || normalized === "mc") return "Mastercard";
    if (normalized === "amex" || normalized === "american express" || normalized === "american_express") return "American Express";
    if (normalized === "paypal") return "PayPal";
    return brand || "-";
};

const mapStatus = (status: string): Transaction["status"] => {
    switch (status) {
        case "succeeded":
            return "Completed";
        case "failed":
            return "Failed";
        case "refunded":
        case "partially_refunded":
            return "Refunded";
        case "pending":
        default:
            return "Pending";
    }
};

export default function TransactionTable() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const queryParams: Record<string, unknown> = { page, per_page: perPage };
    if (planFilter) queryParams.plan_id = planFilter;
    if (statusFilter) queryParams.status = statusFilter;
    if (search.trim()) queryParams.search = search.trim();
    if (date?.from) queryParams.date_from = date.from.toISOString().split("T")[0];
    if (date?.to) queryParams.date_to = date.to.toISOString().split("T")[0];

    const { data: apiResponse, isLoading, isError } = useGetTransactionListQuery({ query: queryParams });

    const {data: planData, isLoading: isPlanLoading, isError: isPlanError} = useGetPlansQuery();

    const planOptions = planData?.data?.map((plan: Plan) => ({
        label: plan.name,
        value: plan.id,
    })) || [];
    
    console.log("planData", planOptions);

    const apiTransactions: Transaction[] = useMemo(() => {
        return (apiResponse?.data ?? []).map((t: ApiTransaction) => ({
            id: t.id,
            transactionId: t.transaction_id,
            img: t.subscriber?.image || userIcon.src,
            subscriber: t.subscriber?.name || "Unknown",
            plan: t.plan?.name || "-",
            amount: `${t.currency || "$"}${t.amount || "0.00"}`,
            status: mapStatus(t.status),
            paymentMethod: mapCardBrand(t.card_brand),
            cardNumber: t.card_last4 ? `****${t.card_last4}` : "-",
            date: new Date(t.purchased_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            time: new Date(t.purchased_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
        }));
    }, [apiResponse]);

    const [transactions, setTransactions] = useState<Transaction[]>(apiTransactions);

    useEffect(() => {
        setTransactions(apiTransactions);
    }, [apiTransactions]);

    const { current_page, last_page, total } = apiResponse?.pagination || {};

    const openView = (row: Transaction) => {
        setSelectedTransaction(row);
        setViewOpen(true);
    };

    const openEdit = (row: Transaction) => {
        setSelectedTransaction(row);
        setEditOpen(true);
    };

    const openDelete = (row: Transaction) => {
        setSelectedTransaction(row);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (selectedTransaction) {
            setTransactions((prev) => prev.filter((item) => item.id !== selectedTransaction.id));
            setDeleteOpen(false);
            setSelectedTransaction(null);
        }
    };

    const columns: Column<Transaction>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="text-gray-500">
                    {((current_page || 1) - 1) * perPage + transactions.indexOf(row) + 1}
                </span>
            ),
        },
        {
            header: "Transaction ID",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.transactionId}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="text-primary" size={14} />
                    </button>
                </div>
            ),
        },
        {
            header: "Subscribers",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.img && (
                        <Image
                            src={row.img}
                            alt={row.subscriber}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                        />
                    )}
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.subscriber}</span>
                </div>
            ),
        },
        {
            header: "Plan",
            cell: (row) => (
                <CustomBadge
                    color={row.plan === "Premium" ? "orange" : row.plan === "Basic" ? "purple" : "gray"}
                    className="font-medium"
                >
                    {row.plan}
                </CustomBadge>
            ),
        },
        {
            header: "Amount",
            cell: (row) => (
                <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.amount}
                    <span className="text-[14px] text-[#777980]">/ year</span>
                </span>
            ),
        },
        {
            header: "Status",
            cell: (row) => {
                if (row.status === "Completed") {
                    return <CustomBadge color="active">{row.status}</CustomBadge>;
                }
                if (row.status === "Failed") {
                    return <CustomBadge color="suspended">{row.status}</CustomBadge>;
                }
                if (row.status === "Refunded") {
                    return <CustomBadge color="orange">{row.status}</CustomBadge>;
                }
                return <CustomBadge color="yellow">{row.status}</CustomBadge>; // Pending
            },
        },
        {
            header: "Payment Method",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.paymentMethod === "VISA" && (
                        <span>
                            <Image src={visaIcon.src} alt="visa" width={28} height={28} className="rounded-full" />
                        </span>
                    )}
                    {row.paymentMethod === "Mastercard" && (
                        <div className="flex -space-x-1">
                            <span><Image src={mastercardIcon.src} alt="mastercard" width={28} height={28} className="rounded-full" /></span>
                        </div>
                    )}
                    {row.paymentMethod === "American Express" && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                            <span><Image src={americanExpressIcon.src} alt="americanExpress" width={28} height={28} className="rounded-full" /></span>
                        </span>
                    )}
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.cardNumber}</span>
                </div>
            ),
        },
        {
            header: "Date & Time",
            cell: (row) => (
                <div className="overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI'] flex flex-col gap-0.5">
                    <div>{row.date}</div>
                    <div className="text-[#A5A5AB]">{row.time}</div>
                </div>

            ),
        },
    ];

    return (
        <div>
            {/* Filters */}
            <div className="flex w-full justify-start lg:justify-end">
                <div className="mb-6 flex flex-col w-full lg:w-full xl:w-2/3 lg:flex-row items-center justify-start gap-4 ">
                    {/* Search */}
                    <div className="relative w-full  xl:w-[300px]">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />

                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="h-10 w-full xl:w-[300px] rounded-md border border-gray-200 bg-white p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primaryColor"
                            type="text"
                            placeholder="Search by user name, email or plan..."
                        />
                    </div>

                    {/* All Plans */}
                    <CustomSelect
                        className="h-[38px]"
                        value={planFilter || "default"}
                        onChange={(value: string) => {
                            setPlanFilter(value === "default" ? "" : value);
                            setPage(1);
                        }}
                        options={planOptions}
                    />

                    {/* All Status */}
                    <CustomSelect
                        className="h-[38px] "
                        value={statusFilter || "default"}
                        onChange={(value: string) => {
                            setStatusFilter(value === "default" ? "" : value);
                            setPage(1);
                        }}
                        options={[
                            { label: "All Status", value: "default" },
                            { label: "Pending", value: "pending" },
                            { label: "Completed", value: "succeeded" },
                            { label: "Failed", value: "failed" },
                            { label: "Refunded", value: "refunded" },
                        ]}
                    />

                    {/* Date Range */}
                    <DateRangePicker
                        className="h-[38px] "
                        date={date}
                        setDate={setDate}
                        placeholder="Select Date Range"
                    />

                    {/* Export */}
                    {/* <button className="flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 text-white transition hover:bg-[#038a9c]">
                        <ArrowDownToLine className="h-4 w-4" />
                        Export
                    </button> */}
                </div>
            </div>

            {isLoading ? (
                <p className="py-12 text-center text-sm text-gray-400">Loading transactions...</p>
            ) : isError ? (
                <p className="py-12 text-center text-sm text-red-500">Failed to load transactions.</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={transactions}
                    // onEdit={openEdit}
                    // onView={openView}
                    // onDelete={openDelete}
                />
            )}

            {/* Pagination */}
            <Pagination
                page={current_page || 1}
                pageSize={perPage}
                total={total || 0}
                totalPages={last_page || 1}
                onPageChange={setPage}
            />

            {/* Edit Modal */}
            <CustomModal
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Transaction"
                size="lg"
            >
                <EditTransactionForm
                    data={selectedTransaction}
                    onClose={() => setEditOpen(false)}
                />
            </CustomModal>

            {/* Delete Modal */}
            <CustomDeletModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Do you want to delete this transaction?"
                description='Click “Delete Now” if you want to delete otherwise press cancel.'
            />
        </div>
    );
}