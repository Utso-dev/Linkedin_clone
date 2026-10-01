"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import {
  useCreateUniversityMutation,
  useGetAllStateQuery,
} from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface AddUniversityProps {
  onClose?: () => void;
}

export default function AddUniversity({ onClose }: AddUniversityProps) {
  const { data: states } = useGetAllStateQuery({});

  const allsates = states?.data || [];

  const stateOptions = allsates.map((state) => ({
    label: state.name,
    value: String(state.id),
  }));
  const [createUniversity, { isLoading }] = useCreateUniversityMutation();

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    latitude: "",
    longitude: "",
    psychologyDegrees: "",
    counselingDegrees: "",
    neuroscienceDegrees: "",
    phoneNumber: "",
    website: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        state_id: Number(formData.state),

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

      console.log("Create University Payload:", payload);

      const response = await createUniversity(payload).unwrap();
      toast.success(response?.message);

      reset();
      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const reset = () => {
    setFormData({
      name: "",
      state: "",
      latitude: "",
      longitude: "",
      psychologyDegrees: "",
      counselingDegrees: "",
      neuroscienceDegrees: "",
      phoneNumber: "",
      website: "",
      location: "",
    });
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

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
        </div>

        <div className="rounded-xl bg-[#D3F4EF] p-4">
          <p className="mb-4 text-base font-semibold leading-6 tracking-[0.08px] text-grayColor1">
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

        <div>
          <div className="flex flex-col space-y-4">
            <CustomInput
              label="Psychology Degrees (BA, MS, PhD)"
              required
              placeholder="Enter Psychology Degrees"
              value={formData.psychologyDegrees}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  psychologyDegrees: e.target.value,
                })
              }
            />

            <CustomInput
              label="Counseling Degrees (MA, MDiv, PhD)"
              required
              placeholder="Enter Counseling Degrees"
              value={formData.counselingDegrees}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  counselingDegrees: e.target.value,
                })
              }
            />

            <CustomInput
              label="Neuroscience Degrees (BS, PhD)"
              required
              placeholder="Enter Neuroscience Degrees"
              value={formData.neuroscienceDegrees}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  neuroscienceDegrees: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Phone Number"
                required
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
              />

              <CustomInput
                label="University Website"
                required
                placeholder="Enter Website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    website: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 py-4">
            <button
              className="cursor-pointer rounded-lg border border-[#B6B6B6] px-3 py-2"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg border bg-primaryColor px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save University"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
