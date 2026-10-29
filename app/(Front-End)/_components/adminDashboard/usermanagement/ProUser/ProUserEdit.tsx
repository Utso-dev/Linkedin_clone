"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

interface JobProfile {
  name: string;
  title: string;
  email: string;
  status: string;
  address: string;
  state: string;
  country: string;
  subscription: string;
}

interface ProUserEditModalProps {
  data?: Partial<JobProfile>;
  onClose?: () => void;
}

export default function ProUserEditModal({
  data,
  onClose,
}: ProUserEditModalProps) {
  // Existing user data will be loaded here initially
  const [job, setJob] = useState<JobProfile>({
    name: data?.name || "",
    title: data?.title || "",
    email: data?.email || "",
    status: data?.status || "",
    address: data?.address || "",
    state: data?.state || "",
    country: data?.country || "",
    subscription: data?.subscription || "",
  });

  // Input update helper
  const handleInputChange = (field: string, value: string | number) => {
    setJob((prev) => ({
      ...prev,
      [field]: String(value),
    }));
  };
  // Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated User:", job);

    // API will be integrated here later

    // Example:
    // await updateUser({
    //   id: data?.id,
    //   ...job,
    // });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name + Last Name */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="First Name"
            required
            placeholder="Enter First Name"
            value={job.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <CustomInput
            label="Last Name"
            required
            placeholder="Enter Last Name"
            value={job.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        {/* Email + Address */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="User Email"
            required
            type="email"
            value={job.email}
            placeholder="Enter User Email"
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <CustomInput
            label="Address"
            required
            placeholder="Enter Address"
            value={job.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        {/* State + Country */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomSelect
            label="State"
            required
            placeholder="Select State"
            value={job.state}
            onChange={(value) => handleInputChange("state", value)}
            options={[
              { label: "Arizona", value: "Arizona" },
              { label: "California", value: "California" },
              { label: "Texas", value: "Texas" },
              { label: "New York", value: "New York" },
              { label: "Alabama", value: "Alabama" },
              { label: "Alaska", value: "Alaska" },
              { label: "Arkansas", value: "Arkansas" },
            ]}
          />

          <CustomSelect
            label="Country"
            required
            placeholder="Select Country"
            value={job.country}
            onChange={(value) => handleInputChange("country", value)}
            options={[
              { label: "USA", value: "USA" },
              { label: "UK", value: "UK" },
              { label: "Canada", value: "Canada" },
            ]}
          />
        </div>

        {/* Title + Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomSelect
            label="Title"
            required
            placeholder="Select Title"
            value={job.title}
            onChange={(value) => handleInputChange("title", value)}
            options={[
              { label: "Mr", value: "Mr" },
              { label: "Mrs", value: "Mrs" },
            ]}
          />

          <CustomSelect
            label="Status"
            required
            placeholder="Select Status"
            value={job.status}
            onChange={(value) => handleInputChange("status", value)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        {/* Phone + Subscription */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            label="Phone Number"
            required
            placeholder="e.g. +880 1234 5678"
          />

          <CustomSelect
            label="Subscription"
            required
            placeholder="Select Subscription"
            value={job.subscription}
            onChange={(value) => handleInputChange("subscription", value)}
            options={[
              { label: "Basic", value: "Basic" },
              { label: "Premium", value: "Premium" },
            ]}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#B6B6B6] px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="cursor-pointer rounded-lg border bg-primaryColor px-4 py-2 text-white hover:opacity-90"
          >
            Save Now
          </button>
        </div>
      </form>
    </div>
  );
}
