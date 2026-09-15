"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useCreateEmploymentMutation } from "@/feature/slice/admin/academia/EmploymentSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface AddEmploymentProps {
  onClose?: () => void;
}
export default function AddEmployment({ onClose }: AddEmploymentProps) {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "",
    state: "",
    cityLocation: "",
    minSalary: "",
    maxSalary: "",
    workMode: "",
    employmentType: "",
  });

  const { data: states } = useGetAllStateQuery({});
  const [createEmployment, { isLoading }] = useCreateEmploymentMutation();

  const stateOptions =
    states?.data?.map((state: any) => ({
      label: state.name,
      value: String(state.id),
    })) || [];

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        company_name: formData.companyName,
        state_id: Number(formData.state),
        category: formData.category,
        location: formData.cityLocation,
        salary_min: formData.minSalary,
        salary_max: formData.maxSalary,
        work_mode: formData.workMode,
        employment_type: formData.employmentType,
      };
      const response = await createEmployment(payload).unwrap();
      toast.success(response?.message || "Job created successfully");
      reset();
      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create job");
    }
  };
  const reset = () => {
    setFormData({
      title: "",
      companyName: "",
      state: "",
      category: "",
      cityLocation: "",
      minSalary: "",
      maxSalary: "",
      workMode: "",
      employmentType: "",
    });
  };

  return (
    <div className="p-4">
      <div className="space-y-5">
        {/* University Name + State */}
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Job Title"
            required
            placeholder="Enter Job Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <CustomInput
            label="Company Name"
            required
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
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

          <CustomSelect
            label="Category"
            required
            placeholder="Select Category"
            value={formData.category}
            onChange={(val) =>
              setFormData({ ...formData, category: val as string })
            }
            options={[
              { label: "State Institution", value: "state_institution" },
              { label: "Private Practice", value: "private_practice" },
            ]}
          />
        </div>

        <div>
          <CustomInput
            label="City/Location"
            required
            placeholder="Enter City/Location"
            value={formData.cityLocation}
            onChange={(e) =>
              setFormData({ ...formData, cityLocation: e.target.value })
            }
          />
        </div>

        <div className="text-grayColor1 text-base font-semibold  leading-6 tracking-wide">
          Salary Range
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Min Salary ($)"
            required
            placeholder="Enter Min Salary"
            value={formData.minSalary}
            onChange={(e) =>
              setFormData({ ...formData, minSalary: e.target.value })
            }
          />
          <CustomInput
            label="Max Salary ($)"
            required
            placeholder="Enter Max Salary"
            value={formData.maxSalary}
            onChange={(e) =>
              setFormData({ ...formData, maxSalary: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Work Mode"
            required
            placeholder="Select Category"
            value={formData.workMode}
            onChange={(val) =>
              setFormData({ ...formData, workMode: val as string })
            }
            options={[
              { label: "On-site", value: "On-site" },
              { label: "Hybrid", value: "Hybrid" },
              { label: "Remote", value: "Remote" },
            ]}
          />

          <CustomSelect
            label="Employment Type "
            required
            placeholder="Select Category"
            value={formData.employmentType}
            onChange={(val) =>
              setFormData({ ...formData, employmentType: val as string })
            }
            options={[
              { label: "Full-Time", value: "Full-Time" },
              { label: "Part-Time", value: "Part-Time" },
              { label: "Contract", value: "Contract" },
              { label: "Internship", value: "Internship" },
            ]}
          />
        </div>
        <div>
          <div className="flex justify-end gap-2.5 py-4">
            <button
              className="border border-[#B6B6B6] rounded-lg px-3 py-2 cursor-pointer "
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
              {isLoading ? "Saving..." : "Save Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
