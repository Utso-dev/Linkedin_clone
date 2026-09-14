"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

import visaIcon from "@/public/images/admin/visa.png";
import mastercardIcon from "@/public/images/admin/paypal.png";
import americanExpressIcon from "@/public/images/admin/american.png";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";

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

interface EditTransactionFormProps {
  data: Transaction | null;
  onClose: () => void;
}

const EditTransactionForm = ({ data, onClose }: EditTransactionFormProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(data?.date || ""),
    to: new Date(data?.date || ""),
  });

  const [formData, setFormData] = useState({
    transactionId: data?.transactionId || "",
    status: data?.status || "Completed",
    email: "pristaciandra@gamil.com",
    subscriber: data?.subscriber || "",
    subscription: `${data?.plan || ""} Subscription`,
    amount: data?.amount?.replace("$", "").trim() || "",
    billingCycle: "Yearly",
    paymentMethod: data?.paymentMethod || "",
    cardNumber: data?.cardNumber || "",
    date: data?.date || "",
    time: data?.time || "",
    notes: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPaymentIcon = () => {
    if (formData.paymentMethod === "VISA") {
      return visaIcon;
    }

    if (formData.paymentMethod === "Mastercard") {
      return mastercardIcon;
    }

    return americanExpressIcon;
  };

  const handleUpdate = () => {
    // API integration later
    console.log(formData);

    onClose();
  };

  if (!data) return null;

  return (
    <div className="px-4 pb-4">
      <p className="mb-6 text-sm text-[#777980]">
        Update the transaction details below,
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {/* Transaction ID */}
        <CustomInput
          label="Transaction ID"
          value={formData.transactionId}
          onChange={(e) => handleChange("transactionId", e.target.value)}
          disabled
        />

        {/* Status */}
        <CustomSelect
          label="Status"
          className="h-[48px] w-full"
          value={formData.status}
          onChange={(value) => handleChange("status", String(value))}
          options={[
            {
              label: "Completed",
              value: "Completed",
            },
            {
              label: "Failed",
              value: "Failed",
            },
            {
              label: "Refunded",
              value: "Refunded",
            },
            {
              label: "Pending",
              value: "Pending",
            },
          ]}
        />

        {/* Email */}
        <div className="col-span-2">
          <CustomInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* Subscriber */}
        <div>
          <label className="mb-1.5 block font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px] text-grayColor1">
            Subscriber
          </label>

          <div className="flex h-[48px] items-center gap-2 rounded-lg border border-[#D5DCE8] bg-[#EEF2F7] px-3">
            <Image
              src={data.img}
              alt={data.subscriber}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#4A4C56]">
                {formData.subscriber}
              </p>

              <p className="truncate text-xs text-[#8B8F98]">
                {formData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <CustomSelect
          label="Subscriptions"
          className="h-[48px] w-full"
          value={formData.subscription}
          onChange={(value) => handleChange("subscription", String(value))}
          options={[
            {
              label: "Premium Subscription",
              value: "Premium Subscription",
            },
            {
              label: "Basic Subscription",
              value: "Basic Subscription",
            },
          ]}
        />

        {/* Amount */}
        <CustomInput
          label="Amount"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
        />

        {/* Billing Cycle */}
        <CustomSelect
          label="Billing Cycle"
          className="h-[48px] w-full"
          value={formData.billingCycle}
          onChange={(value) => handleChange("billingCycle", String(value))}
          options={[
            {
              label: "Yearly",
              value: "Yearly",
            },
            {
              label: "Monthly",
              value: "Monthly",
            },
            {
              label: "Semiannually",
              value: "Semiannually",
            },
          ]}
        />

        {/* Payment Method */}
        <div>
          <label className="mb-1.5 block font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56]">
            Payment Method
          </label>

          <div className="flex h-[48px] items-center gap-2 rounded-lg border border-[#D5DCE8] bg-white px-4">
            <Image
              src={getPaymentIcon()}
              alt={formData.paymentMethod}
              width={32}
              height={22}
              className="h-auto w-8 object-contain"
            />

            <span className="text-sm text-[#4A4C56]">
              {formData.cardNumber}
            </span>
          </div>
        </div>

        {/* Transaction Date & Time */}
        <div>
          <label className="mb-1.5 block font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56]">
            Transaction Date & Time
          </label>

          <div className="relative">
            <DateRangePicker date={date} setDate={setDate} className="w-full" />
          </div>
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="mb-1.5 block font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56]">
            Notes
          </label>

          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add a note (optional)"
            className="h-[144px] w-full resize-none rounded-lg border border-[#D5DCE8] bg-white px-4 py-3 text-sm text-[#4A4C56] outline-none placeholder:text-[#777980] focus:border-primaryColor"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-end gap-4 border-t border-[#E5E7EB] pt-4">
        <button
          type="button"
          onClick={onClose}
          className="h-[42px] rounded-lg border border-[#D5DCE8] bg-white px-5 text-center text-[#0F172A] font-['Inter'] text-[16px] font-medium leading-[22.4px] transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          className="h-[42px] rounded-lg border border-primaryColor bg-[#E9FBFD] px-5 ttext-center text-primaryColor font-['Inter'] text-[16px] font-medium leading-[22.4px] transition hover:bg-[#DDF8FA]"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditTransactionForm;
