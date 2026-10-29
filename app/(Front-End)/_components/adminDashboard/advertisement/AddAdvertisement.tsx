"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { UploadImageIcon } from "@/public/svgIcons/AdminIcon";

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

export default function AdvertisementEditForm({
  job,
  onCancel,
  onUpdate,
}: AdvertisementEditFormProps) {
  const isEditMode = !!job;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("Publish");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<DateRange | undefined>(undefined);
  const [endDate, setEndDate] = useState<DateRange | undefined>(undefined);

  // File upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, PNG or WEBP files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <CustomInput
        label="Title"
        value={title}
        placeholder="Enter your ad title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Categories + Advertiser */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <CustomSelect
            className="h-11 w-full"
            label="Category"
            value={category}
            onChange={(value: string) => setCategory(value)}
            options={[
              { label: "Select your category", value: "" },
              { label: "Event", value: "Event" },
              { label: "Jobs", value: "Jobs" },
              { label: "Antipsychotics", value: "Antipsychotics" },
              { label: "Products", value: "Products" },
              { label: "Research", value: "Research" },
            ]}
          />
        </div>

        <div>
          <CustomSelect
            className="h-11 w-full"
            label="Advertiser"
            value={advertiser}
            onChange={(value: string) => setAdvertiser(value)}
            options={[
              { label: "Select Advertiser", value: "" },
              {
                label: "Neuroscience Solutions",
                value: "Neuroscience Solutions",
              },
              { label: "HealthMind", value: "HealthMind" },
              { label: "BrainBoost Labs", value: "BrainBoost Labs" },
              { label: "Wellness Hub", value: "Wellness Hub" },
              { label: "Cognitive Lab", value: "Cognitive Lab" },
            ]}
          />
        </div>
      </div>

      {/* Note */}
      <div className="rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
        Note: A section will only appear here if you have added at least one
        custom tab in Category Management.
      </div>

      {/* Industry + Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <CustomSelect
            className="h-11 w-full"
            label="Industry"
            value={industry}
            onChange={(value: string) => setIndustry(value)}
            options={[
              { label: "Select your industry", value: "" },
              { label: "Biotech", value: "Biotech" },
              { label: "Psychotropic", value: "Psychotropic" },
              { label: "Publications", value: "Publications" },
            ]}
          />
        </div>

        <div>
          <CustomSelect
            className="h-11 w-full"
            label="Status"
            value={status}
            onChange={(value: string) => setStatus(value)}
            options={[
              { label: "Select your status", value: "" },
              { label: "Publish", value: "Publish" },
              { label: "Pending", value: "Pending" },
              { label: "Cancel", value: "Cancel" },
              { label: "Expired", value: "Expired" },
            ]}
          />
        </div>
      </div>

      {/* Upload Product Image */}
      <div>
        <label className="mb-1.5 block text-base font-semibold leading-[150%]  tracking-[0.08px] text-grayColor1">
          Upload Product Image <span className="">*</span>
        </label>

        {/* Existing image only in Edit mode */}
        {isEditMode && job?.advertisImage && (
          <div className="mb-3">
            <Image
              src={job.advertisImage}
              alt="Current advertisement"
              width={180}
              height={180}
              className="rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        {/* Drop zone */}
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#A5A5AB] bg-gray-50 px-6 py-10 text-center transition hover:border-gray-400">
          <span>
            <UploadImageIcon />
          </span>
          <p className="mt-2 overflow-hidden text-black text-center text-ellipsis  text-base not-italic font-normal leading-6 tracking-[0.08px]">
            Drag and drop your file, or{" "}
            <span
              onClick={handleBrowseClick}
              className="cursor-pointer font-medium text-primaryColor hover:underline"
            >
              browse
            </span>
          </p>
          <p className="mt-1 overflow-hidden text-[#8C8C8C] text-center text-ellipsis whitespace-nowrap  text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
            Support file: JPG, PNG or WEBP
          </p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Starting Date & Ending Date */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <DateRangePicker
            className="h-11 w-full"
            label="Start Date"
            date={startDate}
            setDate={setStartDate}
            placeholder="29 July, 2026 | 10:23 PM"
          />
        </div>

        <div>
          <DateRangePicker
            className="h-11 w-full"
            label="End Date"
            date={endDate}
            setDate={setEndDate}
            placeholder="29 Aug, 2026 | 10:23 PM"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-grayColor1  text-[16px] not-italic font-semibold leading-[24px] tracking-[0.08px]">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-500 focus:ring-0 resize-none"
          placeholder="Enter description..."
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-5 py-2 text-base font-medium leading-[140%] text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onUpdate}
          className="rounded-md bg-primaryColor px-5 py-2 text-base font-medium leading-[140%] text-white text-center hover:bg-[#038a9c]"
        >
          {isEditMode ? "Update" : "Publish Advertisement"}
        </button>
      </div>
    </div>
  );
}
