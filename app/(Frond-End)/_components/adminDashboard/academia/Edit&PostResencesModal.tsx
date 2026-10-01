"use client";

import { useEffect, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import {
  useCreateResedencyMutation,
  useEditResedencyMutation,
} from "@/feature/slice/admin/academia/ResedencesSlice";
import toast from "react-hot-toast";

interface MedicalResidencyFormProps {
  onClose?: () => void;
  mode?: "add" | "edit";
  initialData?: {
    id?: number;
    programName?: string;
    state?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    degrees?: string;
    phoneNumber?: string;
    website?: string;
  };
}

const defaultFormData = {
  programName: "",
  state: "",
  city: "",
  latitude: "",
  longitude: "",
  degrees: "",
  phoneNumber: "",
  website: "",
};

export default function MedicalResidencyForm({
  onClose,
  mode = "add",
  initialData,
}: MedicalResidencyFormProps) {
  const [formData, setFormData] = useState(defaultFormData);

  const { data: states } = useGetAllStateQuery({});

  const [createResedency, { isLoading: isCreating }] =
    useCreateResedencyMutation();

  const [editResedency, { isLoading: isEditing }] = useEditResedencyMutation();

  const isLoading = isCreating || isEditing;

  const stateOptions =
    states?.data?.map((state) => ({
      label: state.name,
      value: String(state.id),
    })) || [];

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        programName: initialData.programName || "",
        state: "",
        city: initialData.city || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        degrees: initialData.degrees || "",
        phoneNumber: initialData.phoneNumber || "",
        website: initialData.website || "",
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (!initialData?.state || !states?.data || mode !== "edit") return;

    const selectedState = states.data.find(
      (state) => state.name === initialData.state,
    );

    if (selectedState) {
      updateField("state", String(selectedState.id));
    }
  }, [mode, initialData?.state, states?.data]);

  const handleSave = async () => {
    const payload = {
      program_name: formData.programName,
      state_id: Number(formData.state),
      location: formData.city,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      degree_types: formData.degrees,
      phone: formData.phoneNumber || null,
      website: formData.website,
    };

    try {
      if (mode === "add") {
        const response = await createResedency(payload).unwrap();

        toast.success(response?.message || "Residency created successfully");
      } else {
        const response = await editResedency({
          id: initialData?.id,
          ...payload,
        }).unwrap();

        toast.success(response?.message || "Residency updated successfully");
      }

      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-5">
        <CustomInput
          label="Program Name"
          required
          placeholder="Enter Program Name"
          value={formData.programName}
          onChange={(e) => updateField("programName", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="State"
            required
            placeholder="Select State"
            value={formData.state}
            onChange={(value) => updateField("state", value as string)}
            options={stateOptions}
          />

          <CustomInput
            label="City/Location"
            required
            placeholder="Enter City/Location"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>

        <div className="bg-[#D3F4EF] rounded-xl p-4">
          <p className="text-grayColor1 font-semibold text-base mb-4">
            Map Coordinates
          </p>

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Latitude"
              required
              placeholder="Latitude (e.g. 33.50)"
              value={formData.latitude}
              onChange={(e) => updateField("latitude", e.target.value)}
            />

            <CustomInput
              label="Longitude"
              required
              placeholder="Longitude (e.g. -86.80)"
              value={formData.longitude}
              onChange={(e) => updateField("longitude", e.target.value)}
            />
          </div>
        </div>

        <CustomInput
          label="Degrees (Comma Separated)"
          placeholder="e.g. MD-DO"
          value={formData.degrees}
          onChange={(e) => updateField("degrees", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Phone Number"
            required
            placeholder="e.g. (123) 456-7890"
            value={formData.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
          />

          <CustomInput
            label="University Website"
            required
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-[#B6B6B6] rounded-lg px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primaryColor text-white rounded-lg px-4 py-2 cursor-pointer"
          >
            {isLoading ? "Saving..." : "Save Program"}
          </button>
        </div>
      </div>
    </div>
  );
}
