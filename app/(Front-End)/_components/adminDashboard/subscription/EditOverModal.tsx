"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";

interface EditOverModalProps {
    data?: any;
    onClose?: () => void;
}

export default function EditOverModal({
    data,
    onClose,
}: EditOverModalProps) {
    const [formData, setFormData] = useState({
        name: data?.name || "Pristia Candra",
        email: data?.email || "pristiacandra@gamil.com",
        billingCycle: data?.billingCycle || "Yearly",
        nextBillingDate: data?.nextBillingDate || "29 July, 2026",
        updateBillingDate: data?.updateBillingDate || "29 July, 2027",
        status: data?.status || "Active",
        joined: data?.joined || "July 09, 2026",
        subscription:
            data?.subscription || "Premium Subscription",
    });
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const handleChange = (
        field: keyof typeof formData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form Data:", formData);

        // API integration here
    };

    return (
        <div className="w-full overflow-hidden rounded-[10px] bg-white">
            <form onSubmit={handleSubmit}>

                {/* ================= Form ================= */}
                <div className="space-y-4 px-6 pt-5">
                    {/* Full Name */}
                    <CustomInput
                        label="Full name"
                        required
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) =>
                            handleChange("name", e.target.value)
                        }
                    />

                    {/* Email */}
                    <CustomInput
                        label="Email"
                        required
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) =>
                            handleChange("email", e.target.value)
                        }
                    />

                    {/* Billing Cycle */}
                    <CustomSelect
                        label="Billing Cycle"
                        required
                        placeholder="Select billing cycle"
                        value={formData.billingCycle}
                        onChange={(value) =>
                            handleChange(
                                "billingCycle",
                                value as string
                            )
                        }
                        options={[
                            {
                                label: "Monthly",
                                value: "Monthly",
                            },
                            {
                                label: "Yearly",
                                value: "Yearly",
                            },
                        ]}
                    />

                    {/* Next Billing Date + Update Billing Date */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                       <DateRangePicker
                            label="Update Billing Date"
                            required
                            date={date}
                            setDate={setDate}
                            placeholder="Select date range"
                        />

                        <DateRangePicker
                            label="Update Billing Date"
                            required
                            date={date}
                            setDate={setDate}
                            placeholder="Select date range"
                        />
                    </div>

                    {/* Status */}
                    <CustomSelect
                        label="Status"
                        required
                        placeholder="Select status"
                        value={formData.status}
                        onChange={(value) =>
                            handleChange(
                                "status",
                                value as string
                            )
                        }
                        options={[
                            {
                                label: "Active",
                                value: "Active",
                            },
                            {
                                label: "Inactive",
                                value: "Inactive",
                            },
                            {
                                label: "Cancelled",
                                value: "Cancelled",
                            },
                            {
                                label: "Pending",
                                value: "Pending",
                            },
                        ]}
                    />

                    {/* Joined + Subscriptions */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CustomInput
                            label="Joined"
                            required
                            placeholder="Select joined date"
                            value={formData.joined}
                            onChange={(e) =>
                                handleChange(
                                    "joined",
                                    e.target.value
                                )
                            }
                        />

                        <CustomSelect
                            label="Subscriptions"
                            required
                            placeholder="Select subscription"
                            value={formData.subscription}
                            onChange={(value) =>
                                handleChange(
                                    "subscription",
                                    value as string
                                )
                            }
                            options={[
                                {
                                    label: "Basic Subscription",
                                    value: "Basic Subscription",
                                },
                                {
                                    label: "Premium Subscription",
                                    value: "Premium Subscription",
                                },
                                {
                                    label: "Enterprise Subscription",
                                    value: "Enterprise Subscription",
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* ================= Footer ================= */}
                <div className="mt-5 border-t border-[#E1E4EA] px-6 py-4">
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 cursor-pointer rounded-lg border border-[#D9DDE5] text-center text-[#0F172A] font-['Inter'] text-[16px] font-medium leading-[22.4px] px-6"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="h-10 cursor-pointer rounded-lg border border-primaryColor bg-[#E9FAF7] px-5 text-center text-primaryColor font-['Inter'] text-base font-medium leading-[140%] hover:bg-[#DDF7FA]"
                        >
                            Save Now
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}