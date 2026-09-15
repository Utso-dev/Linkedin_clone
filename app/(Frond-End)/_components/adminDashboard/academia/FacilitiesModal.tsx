"use client";

import { useState, useEffect } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import {
  useCreateFacilitiesMutation,
  useEditFacilitiesMutation,
} from "@/feature/slice/admin/academia/FacilitesSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface FacilityFormProps {
  onClose?: () => void;
  mode?: "add" | "edit";
  initialData?: {
    id?: number;
    facilityName?: string;
    state?: string;
    type?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    phoneNumber?: string;
    website?: string;
  };
}

export default function FacilityForm({
  onClose,
  mode = "add",
  initialData,
}: FacilityFormProps) {
  const [formData, setFormData] = useState({
    facilityName: "",
    state: "",
    type: "",
    city: "",
    latitude: "",
    longitude: "",
    phoneNumber: "",
    website: "",
  });

  const { data: states } = useGetAllStateQuery({});
  const [createFacilities, { isLoading: isCreating }] =
    useCreateFacilitiesMutation();
  const [editFacilities, { isLoading: isEditing }] =
    useEditFacilitiesMutation();

  const isLoading = isCreating || isEditing;

  const stateOptions =
    states?.data?.map((state: any) => ({
      label: state.name,
      value: String(state.id),
    })) || [];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        facilityName: initialData.facilityName || "",
        state: initialData.state ? String(initialData.state) : "",
        type: initialData.type || "",
        city: initialData.city || "",
        latitude: initialData.latitude ? String(initialData.latitude) : "",
        longitude: initialData.longitude ? String(initialData.longitude) : "",
        phoneNumber: initialData.phoneNumber || "",
        website: initialData.website || "",
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (!initialData?.state || !states?.data || mode !== "edit") return;

    const selectedState = states.data.find(
      (state: any) =>
        state.name?.toLowerCase() === String(initialData.state).toLowerCase() ||
        String(state.id) === String(initialData.state),
    );

    if (selectedState) {
      setFormData((prev) => ({
        ...prev,
        state: String(selectedState.id),
      }));
    }
  }, [mode, initialData?.state, states?.data]);

  const handleSave = async () => {
    const payload = {
      name: formData.facilityName,
      state_id: Number(formData.state),
      type: formData.type,
      location: formData.city,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      phone: formData.phoneNumber || null,
      website: formData.website,
    };

    try {
      if (mode === "add") {
        const response = await createFacilities(payload).unwrap();
        toast.success(response?.message || "Facility created successfully");
      } else {
        const response = await editFacilities({
          id: initialData?.id,
          ...payload,
        }).unwrap();
        toast.success(response?.message || "Facility updated successfully");
      }
      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-1">
      <div className="space-y-5">
        {/* Facility Name */}
        <CustomInput
          label="Facility Name"
          required
          placeholder="Enter Facility Name"
          value={formData.facilityName}
          onChange={(e) =>
            setFormData({ ...formData, facilityName: e.target.value })
          }
        />

        {/* State + Type */}
        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="State"
            required
            placeholder="Select State"
            value={formData.state}
            onChange={(val) =>
              setFormData({ ...formData, state: val as string })
            }
            options={stateOptions}
          />

          <CustomSelect
            label="Type"
            required
            placeholder="Select Type"
            value={formData.type}
            onChange={(val) =>
              setFormData({ ...formData, type: val as string })
            }
            options={[
              { label: "State Institution", value: "state_institution" },
              { label: "University Hospital", value: "university_hospital" },
              { label: "VA Facility", value: "va_facility" },
            ]}
          />
        </div>

        {/* City/Location */}
        <CustomInput
          label="City/Location"
          required
          placeholder="Enter City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />

        {/* Map Coordinates */}
        <div className="bg-[#D3F4EF] rounded-xl p-4">
          <p className="text-[#4A4C56] font-semibold text-base mb-4">
            Map Coordinates
          </p>
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Latitude"
              required
              placeholder="Latitude (e.g. 34.05)"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
            />
            <CustomInput
              label="Longitude"
              required
              placeholder="Longitude (e.g. -118.24)"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
            />
          </div>
        </div>

        {/* Phone + Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Phone Number"
            required
            placeholder="e.g. (123) 456-7890"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          <CustomInput
            label="University Website"
            required
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
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
            {isLoading ? "Saving..." : "Save Facility"}
          </button>
        </div>
      </div>
    </div>
  );
}
