"use client";

import Image from "next/image";
import { useState } from "react";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import CustomInput from "@/components/reusable/dashboard/CustomInput";

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

interface AdvertisementEditFormProps {
    job: Job | null;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EditvertisementEditForm({
    job,
    onCancel,
    onUpdate,
}: AdvertisementEditFormProps) {
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [title, setTitle] = useState(job?.title || "");
    const [category, setCategory] = useState("");
    const [advertiser, setAdvertiser] = useState("");
    const [status, setStatus] = useState(job?.status || "Active");
    const [description, setDescription] = useState(
        "Welcome message for new users on the platform. it introduces Mind Unite and highlights the key benefits of joining our community."
    );

    if (!job) return null;

    return (
        <div className="space-y-5">
            {/* Image + Form Fields */}
            <div className="flex flex-col gap-6 md:flex-row">
                {/* Left - Image Preview */}
                <div className="shrink-0">
                    <Image
                        src={job.advertisImage}
                        alt="Advertisement"
                        width={180}
                        height={180}
                        className="rounded-lg object-center"
                    />
                </div>

                {/* Right - Form Fields */}
                <div className="flex-1 space-y-4">
                    {/* Title */}
                    <CustomInput
                        label="Title"
                        value={title}
                    // onChange={(value: string) => setTitle(value)}
                    />

                    {/* Categories */}
                    <div>

                        <CustomSelect
                            className="h-11 w-full"
                            label="Categories"
                            value={category}
                            onChange={(value: string) => setCategory(value)}
                            options={[
                                { label: "Select Categories", value: "" },
                                { label: "Psychotropic", value: "Psychotropic" },
                                { label: "Publication", value: "Publication" },
                                { label: "Biotech", value: "Biotech" },
                            ]}
                        />
                    </div>

                    {/* Advertiser */}
                    <div>

                        <CustomSelect
                            className="h-11 w-full"
                            label="Advertiser"
                            value={advertiser}
                            onChange={(value: string) => setAdvertiser(value)}
                            options={[
                                { label: "Select Advertiser", value: "" },
                                { label: "Clinical Psychologist", value: "Clinical Psychologist" },
                                { label: "Mind Unite", value: "Mind Unite" },
                            ]}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        
                        <CustomSelect
                            className="h-11 w-full"
                            label="Status"
                            value={status}
                            onChange={(value: string) => setStatus(value)}
                            options={[
                                { label: "Active", value: "Active" },
                                { label: "Suspended", value: "Suspended" },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Starting Date & Ending Date */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                 
                    <DateRangePicker
                        className="h-10 w-full"
                        label="Starting Date"
                        date={date}
                        setDate={setDate}
                        placeholder="29 July, 2026 "
                    />
                </div>

                <div>
                
                    <DateRangePicker
                        className="h-10 w-full"
label="Ending Date"
                        date={date}
                        setDate={setDate}
                        placeholder="29 Aug, 2026 "
                    />
                </div>
            </div>

            {/* Description */}
            {/* Description */}
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm 
             outline-none 
            focus:border-gray-500
             focus:ring-0 
             resize-none 
             transition-colors"
                    placeholder="Enter description..."
                />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onUpdate}
                    className="rounded-md bg-primaryColor px-5 py-2 text-sm font-medium text-white hover:bg-[#038a9c] transition"
                >
                    Update
                </button>
            </div>
        </div>
    );
}