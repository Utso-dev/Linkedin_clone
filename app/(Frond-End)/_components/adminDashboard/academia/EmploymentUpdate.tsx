"use client";

import { useEffect, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useEditEmploymentMutation } from "@/feature/slice/admin/academia/EmploymentSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface EmploymentUpdateProps {
  onClose?: () => void;
  data: any;
}

export default function UpdateEmployment({
  onClose,
  data,
}: EmploymentUpdateProps) {
  const parseSalary = (range?: string) => {
    if (!range) return ["", ""];
    return range
      .replace(/\$|,/g, "")
      .split(/[-–—]/)
      .map((v) => {
        const val = v.trim();
        return /k$/i.test(val)
          ? String(Math.round(parseFloat(val) * 1000))
          : isNaN(+val)
            ? ""
            : String(Math.round(+val));
      });
  };

  const norm = (val?: string, type: "mode" | "type" = "mode") => {
    if (!val) return "";
    const v = val.toLowerCase().replace(/[-\s]/g, "");
    if (type === "mode") {
      if (v === "onsite") return "onsite";
      if (v === "hybrid") return "hybrid";
      if (v === "remote") return "remote";
    } else {
      if (v === "fulltime") return "Full Time";
      if (v === "parttime") return "Part-Time";
      if (v === "contract") return "Contract";
      if (v === "internship") return "Internship";
    }
    return val;
  };

  const [minS, maxS] = parseSalary(data?.salary_range);

  const [formData, setFormData] = useState({
    title: data?.title || data?.jobtitle || "",
    companyName: data?.company_name || data?.companyName || "",
    category: data?.category || "",
    state: data?.state_id ? String(data.state_id) : "",
    cityLocation: data?.location || data?.city || "",
    minSalary: data?.salary_min || data?.minSalary || minS || "",
    maxSalary: data?.salary_max || data?.maxSalary || maxS || "",
    workMode: norm(data?.job_mode || data?.work_mode),
    employmentType: norm(data?.job_type || data?.employment_type, "type"),
  });

  const { data: states } = useGetAllStateQuery({});
  const [editEmployment, { isLoading }] = useEditEmploymentMutation();

  const stateOptions =
    states?.data?.map((s: any) => ({
      label: s.name,
      value: String(s.id),
    })) || [];

  useEffect(() => {
    if (!states?.data || !data) return;
    if (data.state_id) {
      setFormData((p) => ({ ...p, state: String(data.state_id) }));
    } else if (data.state) {
      const name =
        typeof data.state === "object" ? data.state.name : String(data.state);
      const found = states.data.find(
        (s: any) =>
          s.name?.toLowerCase() === name.toLowerCase() || String(s.id) === name,
      );
      if (found) setFormData((p) => ({ ...p, state: String(found.id) }));
    }
  }, [states, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await editEmployment({
        id: data.id,
        title: formData.title,
        company_name: formData.companyName,
        state_id: Number(formData.state),
        category: formData.category,
        location: formData.cityLocation,
        salary_min: formData.minSalary,
        salary_max: formData.maxSalary,
        work_mode: formData.workMode,
        employment_type: formData.employmentType,
      }).unwrap();
      toast.success(res?.message || "Job updated successfully");
      onClose?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update job");
    }
  };

  return (
    <div className="">
      <div className="space-y-5">
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

        <CustomInput
          label="City/Location"
          required
          placeholder="Enter City/Location"
          value={formData.cityLocation}
          onChange={(e) =>
            setFormData({ ...formData, cityLocation: e.target.value })
          }
        />

        <div className="text-[#4A4C56] text-base font-semibold leading-6 tracking-wide">
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
              { label: "On-site", value: "onsite" },
              { label: "Hybrid", value: "hybrid" },
              { label: "Remote", value: "remote" },
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
              { label: "Full-Time", value: "Full Time" },
              { label: "Part-Time", value: "Part-Time" },
              { label: "Contract", value: "Contract" },
              { label: "Internship", value: "Internship" },
            ]}
          />
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
            {isLoading ? "Saving..." : "Save Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
