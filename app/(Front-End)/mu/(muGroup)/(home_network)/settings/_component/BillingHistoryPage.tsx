"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { useGetAllBilingHistoryQuery } from "@/feature/slice/settingSlice";
import dayjs from "dayjs";
import { CreditCard, Loader2 } from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";

export interface PlanInfo {
  id: number;
  name: string;
  plan_type: string;
  billing_cycle: string;
  billing_rate: number;
  badge_color?: string;
}

export interface BillingHistoryItem {
  id: number;
  invoice_no: string;
  transaction_id: string;
  status: string;
  payment_status: string;
  plan?: PlanInfo;
  issue_date: string;
  due_date: string;
  payment_method: string;
  card_brand: string;
  card_last4: string;
  amount: number;
  currency: string;
  amount_formatted?: string;
  receipt_url?: string | null;
}

// Brand icon component matching screenshot aesthetics
const CardBrandIcon = ({
  brand,
  rawMethod,
}: {
  brand?: string;
  rawMethod?: string;
}) => {
  const normalized = `${brand || ""} ${rawMethod || ""}`.toLowerCase();

  if (normalized.includes("visa")) {
    return (
      <span className="font-black italic text-[#1A1F71] text-sm tracking-tight select-none font-sans">
        VISA
      </span>
    );
  }

  if (normalized.includes("master") || normalized.includes("mc")) {
    return (
      <span className="inline-flex items-center shrink-0">
        <svg
          className="w-6 h-4"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7" cy="8" r="7" fill="#EB001B" />
          <circle cx="17" cy="8" r="7" fill="#F79E1B" fillOpacity="0.95" />
        </svg>
      </span>
    );
  }

  if (
    normalized.includes("amex") ||
    normalized.includes("american") ||
    normalized.includes("express")
  ) {
    return (
      <span className="bg-[#006FCF] text-white text-[7px] font-extrabold px-1 py-0.5 rounded leading-tight text-center uppercase tracking-tighter inline-block shrink-0 select-none">
        <span className="block leading-none">AMERICAN</span>
        <span className="block leading-none">EXPRESS</span>
      </span>
    );
  }

  return <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />;
};

function BillingHistoryPage() {
  const { data, isLoading, isError } = useGetAllBilingHistoryQuery("");

  const billingList: BillingHistoryItem[] = useMemo(() => {
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const handleDownloadReceipt = (row: BillingHistoryItem) => {
    if (row.receipt_url) {
      window.open(row.receipt_url, "_blank");
    } else {
      toast.error(
        `Receipt is not available for invoice ${row.invoice_no || row.id}`,
      );
    }
  };

  // Keep the card number masked while showing only its final four digits.
  const getMaskedCardNumber = (row: BillingHistoryItem) => {
    if (row.card_last4) {
      return `•••• ${row.card_last4}`;
    }
    if (row.payment_method) {
      const lastFour = row.payment_method.match(/(\d{4})\s*$/)?.[1];
      if (lastFour) return `•••• ${lastFour}`;
      return row.payment_method.replace(/\*{2,}/g, "••••").trim();
    }
    return "-";
  };

  const columns = [
    {
      label: "Invoice No.",
      accessor: "invoice_no",
      position: "justify-start",
      width: "110px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-4 px-4 text-left font-semibold text-sm text-headerColor whitespace-nowrap">
          {row.invoice_no || `#MU${String(row.id).padStart(6, "0")}`}
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      width: "85px",
      formatter: (_: any, row: BillingHistoryItem) => {
        const normalized = (
          row.status ||
          row.payment_status ||
          ""
        ).toLowerCase();
        const isPaid =
          normalized === "paid" ||
          normalized === "succeeded" ||
          normalized === "completed";
        const isExpired =
          normalized === "expired" ||
          normalized === "failed" ||
          normalized === "unpaid";

        if (isPaid) {
          return (
            <div className="flex items-center justify-center py-4 px-2">
              <span className="inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium rounded-md border border-[#A6F4C5] bg-[#ECFDF3] text-[#027A48]">
                Paid
              </span>
            </div>
          );
        }

        if (isExpired) {
          return (
            <div className="flex items-center justify-center py-4 px-2">
              <span className="inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium rounded-md border border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]">
                {row.status || "Expired"}
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center py-4 px-2">
            <span className="inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium rounded-md border border-amber-200 bg-amber-50 text-amber-700 capitalize">
              {row.status || "Pending"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Plan",
      accessor: "plan",
      position: "justify-center",
      width: "105px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center justify-center py-4 px-2">
          <span className="inline-flex items-center justify-center px-3 py-0.5 text-sm font-medium rounded-md border border-[#FFD9B3] bg-[#FFF6ED] text-[#E05300] whitespace-nowrap">
            {row.plan?.name || "Premium"}
          </span>
        </div>
      ),
    },
    {
      label: "Issue Date",
      accessor: "issue_date",
      position: "justify-start",
      width: "110px",
      formatter: (val: string) => (
        <div className="py-4 px-3 text-left">
          <p className="text-sm font-medium text-grayColor1 whitespace-nowrap">
            {val ? dayjs(val).format("DD MMM YYYY") : "-"}
          </p>
          <p className="text-xs text-grayColor1 whitespace-nowrap mt-0.5">
            {val ? dayjs(val).format("hh:mm A") : ""}
          </p>
        </div>
      ),
    },
    {
      label: "Due Date",
      accessor: "due_date",
      position: "justify-start",
      width: "110px",
      formatter: (val: string) => (
        <div className="py-4 px-3 text-left">
          <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {val ? dayjs(val).format("DD MMM YYYY") : "-"}
          </p>
          <p className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
            {val ? dayjs(val).format("hh:mm A") : ""}
          </p>
        </div>
      ),
    },
    {
      label: "Payment Method",
      accessor: "payment_method",
      position: "justify-start",
      width: "160px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center gap-2.5 py-4 px-3 text-sm text-descriptionColor whitespace-nowrap">
          <CardBrandIcon
            brand={row.card_brand}
            rawMethod={row.payment_method}
          />
          <span className="font-normal text-descriptionColor tracking-wider text-xs sm:text-sm">
            {getMaskedCardNumber(row)}
          </span>
        </div>
      ),
    },
    {
      label: "Amount",
      accessor: "amount",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => {
        if (row.amount_formatted) {
          const parts = row.amount_formatted.split("/");
          return (
            <div className="py-4 px-3 text-sm whitespace-nowrap text-left">
              <span className="font-semibold text-headerColor">
                {parts[0]?.trim()}
              </span>
              {parts[1] && (
                <span className="text-gray-500 font-normal">
                  {" "}
                  / {parts[1]?.trim()}
                </span>
              )}
            </div>
          );
        }
        const currencySymbol =
          row.currency?.toLowerCase() === "usd" || !row.currency
            ? "$"
            : row.currency;
        const price = `${currencySymbol}${Number(row.amount || 0).toFixed(2)}`;
        const period = row.plan?.billing_cycle
          ? ` / ${row.plan.billing_cycle}`
          : " / month";
        return (
          <div className="py-4 px-3 text-sm whitespace-nowrap text-left">
            <span className="font-semibold text-headerColor">{price}</span>
            <span className="text-gray-500 font-normal">{period}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-headerColor tracking-tight">
            Billing History
          </h1>
          <p className="text-sm text-descriptionColor mt-1 font-normal">
            Review your billing history and manage your invoices.
          </p>
        </div>
      </div>

      {/* ----------------- Transactions Section ----------------- */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-headerColor tracking-tight">
          Transactions
        </h2>

        {/* Table Container with border and rounded corners */}
        <div className="border border-borderColor/60 rounded-xl overflow-hidden bg-white shadow-2xs">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-grayColor1">
              <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
              <p className="text-sm font-medium text-gray-500">
                Loading billing history...
              </p>
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-sm text-redColor">
              Failed to load billing history. Please refresh the page.
            </div>
          ) : (
            <DynamicTable
              columns={columns}
              data={billingList}
              tableMinWidth="100%"
              header={{
                bg: "#F9FAFB",
                padding: "14px 14px",
                text: "#475467",
                fontWeight: "600",
                fontSize: "13px",
              }}
              rowStyle={{
                hover: true,
                hoverbg: "hover:bg-gray-50/70",
                border: "border-b border-borderColor/60",
              }}
              noDataMessage="No billing transactions found."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingHistoryPage;
