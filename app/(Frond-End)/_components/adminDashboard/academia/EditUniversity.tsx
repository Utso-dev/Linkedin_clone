"use client";

import { useEffect, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import {
  useEditUniversityMutation,
  useGetAllStateQuery,
} from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface University {
  id: number;
  university_name: string;
  state: string;
  psychology_degrees: string[];
  counseling_degrees: string[];
  neuroscience_degrees: string[];
  map_pin: {
    latitude: string;
    longitude: string;
  } | null;
  website: string;
  phone: string | null;
  location: string | null;
}

interface EditUniversityProps {
  data: University;
  onClose?: () => void;
}

export default function EditUniversity({ data, onClose }: EditUniversityProps) {
  const [formData, setFormData] = useState({
    name: data.university_name,
    stateId: "",
    location: data.location || "",
    latitude: data.map_pin?.latitude || "",
    longitude: data.map_pin?.longitude || "",
    psychologyDegrees: data.psychology_degrees?.join(", ") || "",
    counselingDegrees: data.counseling_degrees?.join(", ") || "",
    neuroscienceDegrees: data.neuroscience_degrees?.join(", ") || "",
    phoneNumber: data.phone || "",
    website: data.website || "",
  });

  const { data: states } = useGetAllStateQuery({});

  const allsates = states?.data || [];

  const stateOptions = allsates.map((state) => ({
    label: state.name,
    value: String(state.id),
  }));

  useEffect(() => {
    const selectedState = allsates.find((state) => state.name === data.state);

    if (selectedState) {
      setFormData((prev) => ({
        ...prev,
        stateId: String(selectedState.id),
      }));
    }
  }, [allsates, data.state]);

  const [editUniversity, { isLoading }] = useEditUniversityMutation();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      id: data.id,
      name: formData.name,
      state_id: Number(formData.stateId),
      location: formData.location,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),

      psychology_degrees: formData.psychologyDegrees
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      counseling_degrees: formData.counselingDegrees
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      neuroscience_degrees: formData.neuroscienceDegrees
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      phone: formData.phoneNumber || null,
      website: formData.website,
    };

    try {
      await editUniversity(payload).unwrap();
      toast.success("University edited successfully");
      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="University Name"
            required
            placeholder="Enter University Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <CustomSelect
            label="State"
            required
            placeholder="Select State"
            value={formData.stateId}
            onChange={(val) =>
              setFormData({ ...formData, stateId: val as string })
            }
            options={stateOptions}
          />
        </div>

        <div className="bg-[#D3F4EF] rounded-xl p-4">
          <p className="text-grayColor1 text-base not-italic font-semibold leading-6 tracking-[0.08px] mb-4">
            Map Coordinates
          </p>

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Latitude"
              required
              placeholder="Latitude (e.g. 34.05)"
              value={formData.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
            />

            <CustomInput
              label="Longitude"
              required
              placeholder="Longitude (e.g. -118.24)"
              value={formData.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <CustomInput
            label="Psychology Degrees (BA, MS, PhD)"
            required
            placeholder="Enter Psychology Degrees"
            value={formData.psychologyDegrees}
            onChange={(e) => handleChange("psychologyDegrees", e.target.value)}
          />

          <CustomInput
            label="Counseling Degrees (MA, MDiv, PhD)"
            required
            placeholder="Enter Counseling Degrees"
            value={formData.counselingDegrees}
            onChange={(e) => handleChange("counselingDegrees", e.target.value)}
          />

          <CustomInput
            label="Neuroscience Degrees (BS, PhD)"
            required
            placeholder="Enter Neuroscience Degrees"
            value={formData.neuroscienceDegrees}
            onChange={(e) =>
              handleChange("neuroscienceDegrees", e.target.value)
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Phone Number *"
              required
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />

            <CustomInput
              label="University Website *"
              required
              placeholder="Enter Website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 py-4">
          <button
            className="border border-[#B6B6B6] rounded-lg px-3 py-2 cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="border cursor-pointer bg-primaryColor text-white rounded-lg px-3 py-2"
            type="button"
          >
            {isLoading ? "Saving..." : "Save University"}
          </button>
        </div>
      </div>
    </div>
  );
}
