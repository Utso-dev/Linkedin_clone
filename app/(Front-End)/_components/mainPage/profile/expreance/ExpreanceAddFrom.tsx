"use client";

import CommonSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useAddExperienceMutation,
  useGetCompanySuggestionsQuery,
  useGetSkillSuggestionsQuery,
  useUpdateExperienceMutation,
} from "@/feature/slice/user/experienceSlice";
import {
  employmentTypeOptions,
  locationTypeOptions,
  monthAliasMap,
  monthOptions,
  yearOptions,
} from "@/public/demoData/RealData";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type ExperienceFormValues = {
  title: string;
  employment_type: string;
  company_name: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
  location: string;
  location_type: string;
  description: string;
  skills: string[];
  skills_data?: string[];
};

type ExpreanceAddFromProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitData?: (values: any) => void;
  initialValues?: Partial<any>;
};

const defaultExperienceValues: ExperienceFormValues = {
  title: "",
  employment_type: "",
  company_name: "",
  start_month: "",
  start_year: "",
  end_month: "",
  end_year: "",
  is_current: false,
  location: "",
  location_type: "",
  description: "",
  skills: [],
};

function normalizeSkillsList(skills?: unknown): string[] {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;

      if (skill && typeof skill === "object") {
        const typedSkill = skill as Record<string, unknown>;
        const value =
          typedSkill.value ??
          typedSkill.label ??
          typedSkill.name ??
          typedSkill.skill_name ??
          typedSkill.title;

        return typeof value === "string" ? value : "";
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeExperienceValues(
  values?: Partial<ExperienceFormValues> & {
    start_date?: string;
    end_date?: string;
  },
): ExperienceFormValues {
  const [startMonthRaw = "", startYearRaw = ""] =
    values?.start_date?.trim().split(/\s+/) ?? [];
  const [endMonthRaw = "", endYearRaw = ""] =
    values?.end_date?.trim().split(/\s+/) ?? [];

  const startMonth =
    values?.start_month ||
    monthAliasMap[startMonthRaw.toLowerCase()] ||
    startMonthRaw;
  const endMonth =
    values?.end_month ||
    monthAliasMap[endMonthRaw.toLowerCase()] ||
    endMonthRaw;

  return {
    ...defaultExperienceValues,
    ...values,
    start_month: startMonth,
    start_year: values?.start_year || startYearRaw,
    end_month: endMonth,
    end_year: values?.end_year || endYearRaw,
    skills: normalizeSkillsList(values?.skills ?? values?.skills_data),
  };
}

function ExpreanceAddFrom({
  open,
  setOpen,
  onSubmitData,
  initialValues,
}: ExpreanceAddFromProps) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addExperience, { isLoading }] = useAddExperienceMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm<ExperienceFormValues>({
    defaultValues: defaultExperienceValues,
  });
  const { data: companyOptions } = useGetCompanySuggestionsQuery("company");
  const { data: skillsData } = useGetSkillSuggestionsQuery("skill-suggestions");
  const [
    updateExperience,
    { isLoading: isCompanyLoading, isError: isCompanyError },
  ] = useUpdateExperienceMutation();

  useEffect(() => {
    if (!open) return;

    const mergedValues = normalizeExperienceValues(initialValues);

    setShowSkillsPicker(mergedValues.skills.length > 0);
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    reset(
      normalizeExperienceValues({
        ...initialValues,
        skills: normalizeSkillsList(
          initialValues?.skills_data || initialValues?.skills,
        ),
      }),
    );
  }, [open, initialValues, reset]);

  const isCurrent = watch("is_current");

  useEffect(() => {
    if (isCurrent) {
      const current = getValues();
      reset({ ...current, end_month: "", end_year: "" });
    }
  }, [isCurrent, reset, getValues]);

  const descriptionCount = watch("description")?.length || 0;
  const selectedSkills = watch("skills") || [];

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      const payload = values.is_current
        ? { ...values, end_month: "", end_year: "" }
        : values;

      const response = initialValues
        ? await updateExperience({
            id: initialValues.id,
            payload,
          }).unwrap()
        : await addExperience(payload).unwrap();
      setOpen(false);
      toast.success(response.message || "Experience added successfully");
    } catch (error) {
     
      setError(
        error?.data?.message ||
          "An error occurred while adding the experience. Please try again.",
      );
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-205 rounded-xl"
    >
      <div className=" flex h-[85vh] max-h-[85vh] flex-col">
        <h2 className="md:text-[32px] text-lg font-semibold leading-[1.1] px-4 pt-4 md:pt-5 sm:px-5 text-headerColor sm:text-[30px]">
          {initialValues ? "Edit Experience" : "Add Experience"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => error && setError(null)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <ReusableInput
              id="title"
              label="Title"
              placeholder="Title"
              required
              error={errors.title?.message ? "Title is required" : undefined}
              {...register("title")}
              className="rounded-lg border-borderColor"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
                Employment type <span className="text-redColor">*</span>
              </label>
              <Controller
                name="employment_type"
                rules={{ required: "Employment type is required" }}
                control={control}
                render={({ field }) => (
                  <CommonSelectField
                    value={field.value || undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      if (error) setError(null);
                    }}
                    options={employmentTypeOptions}
                    allowCustomInput
                    placeholder="Select Industry here..."
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                  />
                )}
              />
              {errors.employment_type && (
                <p className="mt-1 text-sm text-redColor">
                  {errors.employment_type.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
                Company or Organization
              </label>
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <CommonSelectField
                    placeholder="Select company or organization"
                    value={field.value || undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      if (error) setError(null);
                    }}
                    options={companyOptions?.data?.map((inst: any) => ({
                      value: inst.name,
                      label: inst.name,
                    }))}
                    allowCustomInput
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
                Start date <span className="text-redColor">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Controller
                    name="start_month"
                    control={control}
                    rules={{ required: "Start month is required." }}
                    render={({ field }) => (
                      <CommonSelectField
                        value={field.value || undefined}
                        onChange={(value) => {
                          field.onChange(value);
                          if (error) setError(null);
                        }}
                        options={monthOptions}
                        allowCustomInput
                        placeholder="Month"
                        className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                      />
                    )}
                  />
                  {errors.start_month && (
                    <p className="mt-1 text-sm text-redColor">
                      {errors.start_month.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    name="start_year"
                    control={control}
                    defaultValue={String(new Date().getFullYear())}
                    rules={{ required: "Start year is required." }}
                    render={({ field }) => (
                      <CommonSelectField
                        value={
                          field.value
                            ? String(field.value)
                            : String(new Date().getFullYear())
                        }
                        type="number"
                        onChange={(value) => {
                          field.onChange(value);
                          if (error) setError(null);
                        }}
                        options={yearOptions}
                        allowCustomInput
                        placeholder="Year"
                        className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                      />
                    )}
                  />
                  {errors.start_year && (
                    <p className="mt-1 text-sm text-redColor">
                      {errors.start_year.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
                End date <span className="text-redColor">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Controller
                    name="end_month"
                    control={control}
                    rules={{
                      required: isCurrent ? false : "End month is required",
                    }}
                    render={({ field }) => (
                      <CommonSelectField
                        value={field.value || undefined}
                        onChange={(value) => {
                          field.onChange(value);
                          if (error) setError(null);
                        }}
                        options={monthOptions}
                        allowCustomInput
                        placeholder="Month"
                        isDisabled={isCurrent}
                        className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                      />
                    )}
                  />
                  {errors.end_month && (
                    <p className="mt-1 text-sm text-redColor">
                      {errors.end_month.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    name="end_year"
                    control={control}
                   
                    rules={{
                      required: isCurrent ? false : "End year is required",
                    }}
                    render={({ field }) => (
                      <CommonSelectField
                        value={
                          field.value
                            ? String(field.value)
                            : isCurrent ? undefined : String(new Date().getFullYear())
                        }
                        onChange={(value) => {
                          field.onChange(value);
                          if (error) setError(null);
                        }}
                        type="number"
                        options={yearOptions}
                        allowCustomInput
                        placeholder="Year"
                        isDisabled={isCurrent}
                        className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                      />
                    )}
                  />
                  {errors.end_year && (
                    <p className="mt-1 text-sm text-redColor">
                      {errors.end_year.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-base text-descriptionColor">
                <input
                  type="checkbox"
                  {...register("is_current")}
                  className="h-4 w-4"
                />
                I&apos;m currently working in this position
              </label>
            </div>

            <ReusableInput
              id="location"
              label="Location"
              placeholder="Location"
              required
              error={
                errors.location?.message ? "Location is required" : undefined
              }
              {...register("location")}
              className="rounded-lg border-borderColor"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
                Location type <span className="text-redColor">*</span>
              </label>
              <Controller
                name="location_type"
                control={control}
                rules={{ required: "Location type is required" }}
                render={({ field }) => (
                  <CommonSelectField
                    value={field.value || undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      if (error) setError(null);
                    }}
                    options={locationTypeOptions}
                    placeholder="Select here..."
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <p className="mt-1 text-sm text-descriptionColor">
                Select a location ex. hybrid
              </p>
              {errors.location_type && (
                <p className="mt-1 text-sm text-redColor">
                  {errors.location_type.message}
                </p>
              )}
            </div>

            <div>
              <ReusableTextarea
                label="Description"
                placeholder="Description"
                maxLength={2500}
                {...register("description")}
                className="min-h-32 w-full rounded-lg border border-borderColor bg-white px-3 py-2 text-base text-descriptionColor outline-none"
              />
              <p className="mt-1 text-sm text-descriptionColor">
                {descriptionCount}/2500
              </p>
            </div>

            <div className="">
              <label className="mb-0.5 block text-[14px] font-semibold text-descriptionColor">
                Skills
              </label>
              <p className="mb-2 text-sm text-descriptionColor">
                Up to 5 skills in this experience.
              </p>

              {showSkillsPicker && (
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <CommonSelectField
                      isMulti
                      allowCustomInput
                      maxCount={5}
                      values={field.value || []}
                      onChangeValues={(value) => {
                        field.onChange(value);
                        if (error) setError(null);
                      }}
                      options={
                        skillsData?.data?.map((skill: { name: string }) => ({
                          value: skill.name,
                          label: skill.name,
                        })) || []
                      }
                      placeholder="Select skill here..."
                      className="mb-2.5 w-full  [&_.ant-select-selector]:min-h-13! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                    />
                  )}
                />
              )}

              <button
                type="button"
                onClick={() => setShowSkillsPicker(true)}
                disabled={selectedSkills.length >= 5}
                className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-full border border-primaryColor px-4 py-1.5 text-base font-semibold text-primaryColor transition-colors hover:bg-primaryColor hover:text-whiteColor disabled:cursor-not-allowed disabled:border-borderColor disabled:text-descriptionColor"
              >
                <Plus className="h-4 w-4" />
                Add skill
              </button>
            </div>
          </div>
          <div className="border-t border-borderColor py-2 md:py-5">
            {error && (
              <p className="mb-2 text-center text-sm text-redColor">{error}</p>
            )}
            <div className="flex justify-center">
              <button
                disabled={isLoading || isCompanyLoading}
                type="submit"
                className="min-w-28 disabled:cursor-not-allowed disabled:bg-bgColor disabled:text-grayColor1  cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
              >
                {isLoading || isCompanyLoading
                  ? "Saving..."
                  : initialValues
                    ? "Update Experience"
                    : "Add Experience"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default ExpreanceAddFrom;
