"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateJobsMutation,
  useGetJobDetailsQuery,
  useGetStateByCityQuery,
  useUpdateJobsMutation,
} from "@/feature/slice/jobs/jobSlice";
import { useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import { JobPositionFormData } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  categoryOptions,
  employmentOfferingOptions,
  employmentTypeOptions,
  levelOptions,
  locationTypeOptions,
  networkOptions,
} from "@/public/demoData/RealData";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import JobPostConfirmation from "./JobPostConfirmation";

interface CreateJobsFromProps {
  onSuccess?: () => void;
  id?: string;
}

const flatCategoryOptions = categoryOptions.flatMap((group) => group.options);

function CreateJobsFrom({ onSuccess, id }: CreateJobsFromProps) {
  const router = useRouter();
  const [isCreated, setIsCreated] = useState(false);
  const [createJobs, { isLoading: isCreating }] = useCreateJobsMutation();
  const [updateJobs, { isLoading: isUpdating }] = useUpdateJobsMutation();
  const { data: jobResponse } = useGetJobDetailsQuery(id, { skip: !id });
  const { data: statesData, isLoading: isStateLoading } =
    useGetAllStatesQuery(undefined);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [jobId, setJobId] = useState<string | number | null>(null);
  const stateOptions = (statesData?.data || []).map((s: any) => ({
    value: String(s.id),
    label: s.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobPositionFormData>({
    defaultValues: {
      job_title: "",
      position: "",
      network_type: "Psychology",
      category: "",
      employment_offering: "State and Institution",
      work_mode: "",
      employment_type: "",
      level: "",
      experience: "",
      state_id: "",
      city_id: "",
      email: "",
      phone_number: "",
      salary_min: "",
      salary_max: "",
      salary_type: "",
      website: "",
      job_description: "",
      tags: "",
      information_confirmed: false,
    },
  });

  const selectedStateId = watch("state_id");

  // Find the selected state's code from statesData
  const selectedStateObj = (statesData?.data || []).find(
    (s: any) =>
      String(s.id) === String(selectedStateId) ||
      s.name === selectedStateId ||
      s.code === selectedStateId,
  );
  const selectedStateCode = selectedStateObj?.code;

  const { data: citiesData, isLoading: isCitiesLoading } =
    useGetStateByCityQuery(selectedStateCode, {
      skip: !selectedStateCode,
    });

  const cityOptions = useMemo(() => {
    const rawCities = citiesData?.data ?? citiesData ?? [];
    if (!Array.isArray(rawCities)) return [];
    return rawCities.map((c: any) => {
      if (typeof c === "string") {
        return { value: c, label: c };
      }
      return {
        value: String(c?.id ?? c?.name ?? c?.city ?? c),
        label: c?.name || c?.city || c?.label || String(c),
      };
    });
  }, [citiesData]);

  const watchedDescription = watch("job_description");

  const getOptionValue = (
    options: { value: string; label: string }[],
    value: unknown,
  ) => {
    if (!value) return "";
    const normalized = String(value).trim().toLowerCase();
    return (
      options.find(
        (option) =>
          option.value.trim().toLowerCase() === normalized ||
          option.label.trim().toLowerCase() === normalized,
      )?.value || String(value)
    );
  };

  useEffect(() => {
    const job = (jobResponse?.data ?? jobResponse) as any;
    if (!job || !id) return;

    reset({
      job_title: job.job_title || "",
      position: job.position || "",
      network_type: getOptionValue(networkOptions, job.network_type),
      category: getOptionValue(flatCategoryOptions, job.category),
      employment_offering: getOptionValue(
        employmentOfferingOptions,
        job.employment_offering,
      ),
      work_mode: getOptionValue(locationTypeOptions, job.work_mode),
      employment_type: getOptionValue(
        employmentTypeOptions,
        job.employment_type,
      ),
      level: getOptionValue(levelOptions, job.level),
      experience: job.experience || "",
      state_id: job.state?.id ? String(job.state.id) : "",
      city_id: job.city?.id ? String(job.city.id) : "",
      email: job.email || "",
      phone_number: job.phone_number || "",
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      salary_type: job.salary_type || "",
      website: job.website || "",
      job_description: job.job_description || "",
      start_date: job.announcement_start_date
        ? new Date(`${job.announcement_start_date}T00:00:00`)
        : undefined,
      end_date: job.announcement_end_date
        ? new Date(`${job.announcement_end_date}T00:00:00`)
        : undefined,
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : job.tags || "",
      information_confirmed: Boolean(job.information_confirmed),
    });
  }, [jobResponse, id, reset]);

  const onSubmit = async (data: JobPositionFormData) => {
    try {
      const parseNumber = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        if (typeof val === "number") return val;
        const cleaned = String(val).replace(/[^0-9.]/g, "");
        return cleaned !== "" ? Number(cleaned) : undefined;
      };

      const parseId = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        const num = Number(val);
        return isNaN(num) ? val : num;
      };

      const payload = {
        job_title: data.job_title,
        position: data.position,
        network_type: data.network_type,
        category: data.category,
        employment_offering: data.employment_offering,
        work_mode: data.work_mode,
        employment_type: data.employment_type,
        level: data.level,
        experience: data.experience,
        state_id:
          parseId(data.state_id) ??
          (selectedStateObj?.id ? Number(selectedStateObj.id) : undefined),
        city_id: parseId(data.city_id),
        email: data.email,
        phone_number: data.phone_number,
        salary_min: parseNumber(data.salary_min),
        salary_max: parseNumber(data.salary_max),
        salary_type: data.salary_type,
        website: data.website || undefined,
        job_description: data.job_description,
        start_date: data.start_date
          ? format(data.start_date, "yyyy-MM-dd")
          : undefined,
        end_date: data.end_date
          ? format(data.end_date, "yyyy-MM-dd")
          : undefined,
        tags: data.tags || undefined,
        information_confirmed: data.information_confirmed ? 1 : 0,
      };

      if (id) {
      const response=   await updateJobs({ id, data: payload }).unwrap();
      console.log(response, "setJobId");
      
        toast.success("Job position updated successfully!");
        setJobId(response.id);
        setIsCreated(true);
      } else {
       const response =  await createJobs(payload).unwrap();
        toast.success("Job position posted successfully!");
        setJobId(response.id);
        setIsCreated(true);
      }
      reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/mu/job-listing");
      }
    } catch (error: any) {
      console.error("Error creating job position:", error);
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(
          serverErrors,
        ).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        toast.error(
          error?.data?.message ||
            "Failed to create job position. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-headerColor">
          {id ? "Update position" : "Create new position"}
        </h1>
        <p className="text-sm text-descriptionColor mt-1">
          Complete the information below to publish a professional job
          opportunity and connect with qualified candidates.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="md:grid space-y-4 grid-cols-1 md:grid-cols-2 md:space-y-0 md:gap-6">
          {/* Row 1: Job Title & Position */}
          <ReusableInput
            id="job_title"
            label="Job Title"
            required
            placeholder="e.g., Assistant Professor of Psychology"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.job_title?.message}
            {...register("job_title", {
              required: "Job title is required",
            })}
          />

          <ReusableInput
            id="position"
            label="Position"
            required
            placeholder="e.g., Clinical Psychologist"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.position?.message}
            {...register("position", {
              required: "Position is required",
            })}
          />

          {/* Row 2: Network & Employment Offerings */}
          <div className="space-y-1.5">
            <Label
              htmlFor="network_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Network <span className="text-redColor">*</span>
            </Label>

            <Controller
              control={control}
              name="network_type"
              rules={{ required: "Network is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`network-${field.value || "empty"}`}
                  id="network_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Network"
                  options={networkOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.network_type && (
              <p className="text-redColor text-xs">
                {errors.network_type.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="category"
              className="text-sm text-descriptionColor font-medium"
            >
              Categories <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`category-${field.value || "empty"}`}
                  id="category"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Category"
                  options={categoryOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.category && (
              <p className="text-redColor text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="employment_offering"
              className="text-sm text-descriptionColor font-medium"
            >
              Employment Offerings <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="employment_offering"
              rules={{ required: "Employment offering is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`employment_offering-${field.value || "empty"}`}
                  id="employment_offering"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Employment"
                  options={employmentOfferingOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.employment_offering && (
              <p className="text-redColor text-xs">
                {errors.employment_offering.message}
              </p>
            )}
          </div>

          {/* Row 3: Work mode & Employment Type */}
          <div className="space-y-1.5">
            <Label
              htmlFor="work_mode"
              className="text-sm text-descriptionColor font-medium"
            >
              Work mode <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="work_mode"
              rules={{ required: "Work mode is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`work_mode-${field.value || "empty"}`}
                  id="work_mode"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select work mode"
                  options={locationTypeOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.work_mode && (
              <p className="text-redColor text-xs">
                {errors.work_mode.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="employment_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Employment Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="employment_type"
              rules={{ required: "Employment type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`employment_type-${field.value || "empty"}`}
                  id="employment_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Type"
                  options={employmentTypeOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.employment_type && (
              <p className="text-redColor text-xs">
                {errors.employment_type.message}
              </p>
            )}
          </div>

          {/* Row 4: Level & Experience */}
          <div className="space-y-1.5">
            <Label
              htmlFor="level"
              className="text-sm text-descriptionColor font-medium"
            >
              Level <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="level"
              rules={{ required: "Level is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`level-${field.value || "empty"}`}
                  id="level"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="e.g., Mid-Level"
                  options={levelOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.level && (
              <p className="text-redColor text-xs">{errors.level.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="network_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Salary Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="salary_type"
              rules={{ required: "Salary type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`salary_type-${field.value || "empty"}`}
                  id="salary_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select salary type"
                  options={[
                    { value: "Hourly", label: "Hourly" },
                    { value: "Monthly", label: "Monthly" },
                    { value: "Yearly", label: "Yearly" },
                  ]}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.salary_type && (
              <p className="text-redColor text-xs">
                {errors.salary_type.message}
              </p>
            )}
          </div>

          <ReusableInput
            id="experience"
            label="Experience"
            required
            placeholder="e.g., 1 year"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.experience?.message}
            {...register("experience", {
              required: "Experience is required",
            })}
          />

          {/* Row 5: State & City */}
          <div className="space-y-1.5">
            <Label
              htmlFor="state_id"
              className="text-sm text-descriptionColor font-medium"
            >
              State <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="state_id"
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("city_id", "");
                  }}
                  options={stateOptions}
                  placeholder={
                    isStateLoading ? "Loading states..." : "Select State"
                  }
                  isDisabled={isStateLoading}
                  className=" w-full [&_.ant-select-selector]:h-11! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200! [&_.ant-select-selector]:px-3!"
                />
              )}
            />
            {errors.state_id && (
              <p className="text-redColor text-xs">{errors.state_id.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="city_id"
              className="text-sm text-descriptionColor font-medium"
            >
              City <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="city_id"
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  key={`city-select-${selectedStateCode || "none"}`}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={cityOptions}
                  placeholder={
                    !selectedStateId
                      ? "Select State first"
                      : isCitiesLoading
                        ? "Loading cities..."
                        : "Select City"
                  }
                  isDisabled={!selectedStateId || isCitiesLoading}
                  className="w-full [&_.ant-select-selector]:h-11! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200! [&_.ant-select-selector]:px-3!"
                />
              )}
            />
            {errors.city_id && (
              <p className="text-redColor text-xs">{errors.city_id.message}</p>
            )}
          </div>

          {/* Row 6: Email Address & Phone Number */}
          <ReusableInput
            id="email"
            type="email"
            label="Email Address"
            required
            placeholder="person@email.com"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.email?.message}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          <ReusableInput
            id="phone_number"
            type="tel"
            label="Phone Number"
            required
            placeholder="Enter your phone number."
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.phone_number?.message}
            {...register("phone_number", {
              required: "Phone number is required",
            })}
          />

          {/* Row 7: Salary Range min & Salary Range Max */}
          <ReusableInput
            id="salary_min"
            label="Salary Range min"
            required
            placeholder="e.g. $20,000 USD"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.salary_min?.message}
            {...register("salary_min", {
              required: "Minimum salary range is required",
            })}
          />

          <ReusableInput
            id="salary_max"
            label="Salary Range Max"
            required
            placeholder="e.g. $90,000 USD"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.salary_max?.message}
            {...register("salary_max", {
              required: "Maximum salary range is required",
            })}
          />

          <div className="col-span-2">
            <ReusableInput
              id="website"
              label="Website"
              placeholder="e.g., www.companywebsite.com"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.website?.message}
              {...register("website")}
            />
          </div>

          {/* Row 9: Job Description (Full width) */}
          <div className="space-y-1.5 md:col-span-2">
            <ReusableTextarea
              id="job_description"
              label="Job Description"
              required
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full rounded-lg border border-borderColor text-sm text-headerColor p-3 placeholder:text-placeholderColor"
              error={errors.job_description?.message}
              {...register("job_description", {
                required: "Job description is required",
                maxLength: {
                  value: 5000,
                  message: "Description cannot exceed 5000 characters",
                },
              })}
            />
            <div className="text-xs text-gray-500 font-normal">
              {watchedDescription?.length || 0}/5000
            </div>
          </div>

          {/* Row 10: Start Date & End Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor="start_date"
              className="text-sm text-descriptionColor font-medium"
            >
              Start Date
            </Label>
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="start_date"
                      type="button"
                      className={cn(
                        "h-12! md:h-13! w-full px-3.5 border border-borderColor rounded-lg bg-white flex items-center justify-center gap-2.5 text-sm text-headerColor hover:bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all cursor-pointer",
                        !field.value && "text-gray-700 font-normal",
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 text-headerColor shrink-0" />
                      <span className="truncate">
                        {field.value
                          ? format(field.value, "MMM dd, yyyy")
                          : "Start Date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white z-100000 rounded-xl shadow-xl border border-borderColor"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setStartDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="end_date"
              className="text-sm text-descriptionColor font-medium"
            >
              End Date
            </Label>
            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="end_date"
                      type="button"
                      className={cn(
                        "h-12! md:h-13! w-full px-3.5 border border-borderColor rounded-lg bg-white flex items-center justify-center gap-2.5 text-sm text-headerColor hover:bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all cursor-pointer",
                        !field.value && "text-gray-700 font-normal",
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 text-headerColor shrink-0" />
                      <span className="truncate">
                        {field.value
                          ? format(field.value, "MMM dd, yyyy")
                          : "End Date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white z-100000 rounded-xl shadow-xl border border-borderColor"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setEndDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          {/* Row 11: Add Tags (Full width) */}
          <div className="md:col-span-2">
            <ReusableInput
              id="tags"
              label="Add Tags"
              placeholder="e.g., Clinical Psychologist, Research Assistant, Professor of Psychology"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.tags?.message}
              {...register("tags")}
            />
          </div>

          {/* Row 12: Review Before Publishing */}
          <div className="space-y-2 pt-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-headerColor">
              Review Before Publishing
            </h3>
            <div className="flex items-start gap-3">
              <Controller
                control={control}
                name="information_confirmed"
                rules={{
                  required:
                    "You must confirm that all information provided is accurate",
                }}
                render={({ field }) => (
                  <Checkbox
                    id="information_confirmed"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 border border-primaryColor  data-[state=checked]:bg-primaryColor  data-[state=checked]:text-white data-[state=checked]:border-primaryColor rounded"
                  />
                )}
              />
              <label
                htmlFor="information_confirmed"
                className="text-xs md:text-sm text-gray-600 leading-snug cursor-pointer select-none"
              >
                I confirm that all information provided is accurate and that I
                am authorized to publish this position on behalf of my
                organization.
              </label>
            </div>
            {errors.information_confirmed && (
              <p className="text-redColor text-xs">
                {errors.information_confirmed.message}
              </p>
            )}
          </div>

          {/* Row 13: Submit Button */}
          <div className="flex justify-center pt-4 pb-2 md:col-span-2">
            <ButtonReuseable
              type="submit"
              disabled={isSubmitting || isCreating || isUpdating}
              title={id ? "Update this Position" : "Post this Position"}
              sendingMsg={id ? "Updating Position..." : "Posting Position..."}
            />
          </div>
        </div>
      </form>
      {
        isCreated && jobId &&  <JobPostConfirmation open={isCreated} setOpen={setIsCreated} jobId={jobId} />
      }
    </div>
  );
}

export default CreateJobsFrom;
