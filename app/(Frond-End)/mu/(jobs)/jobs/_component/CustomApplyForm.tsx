"use client";

import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { useApplyUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import {
  useGetMyProfileQuery,
  useGetUserProfileQuery,
} from "@/feature/slice/user/userSlice";
import { cn } from "@/lib/utils";
import { CloudUpload, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DetailsSkeleton from "../../../(pro-industry)/_component/jobs/JobsSIngleSkleton";
import CustomJobApplyDetails from "./CustomJobApplyDetails";
import ButtonReuseable from "@/components/reusable/CustomButton";

interface CustomApplyFormProps {
  jobId: string | number;
}

interface CustomApplyFormValues {
  fullName: string;
  email: string;
  phone: string;
  experiences: string;
  currentPosition: string;
  expectedSalary: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  aboutYourself: string;
  skills: string;
  resume: File | null;
}

function CustomApplyForm({ jobId }: CustomApplyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Fetch Job Details
  const { data: jobData, isLoading: isJobLoading } = useGetJobDetailsQuery(
    jobId,
    { skip: !jobId },
  );

  // 2. Fetch User Profile for Pre-population
  const { data: profileResponse } = useGetMyProfileQuery("profile");
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const [applyUserJob, { isLoading: isSubmittingJob }] =
    useApplyUserJobMutation();

  const user = userProfileData?.user || profileResponse?.data;
  const job = jobData?.data ?? jobData;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomApplyFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      experiences: "",
      currentPosition: "",
      expectedSalary: "",
      location: "",
      linkedinUrl: "",
      portfolioUrl: "",
      coverLetter: "",
      aboutYourself: "",
      skills: "",
      resume: null,
    },
  });

  const resumeFile = watch("resume");

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      const fullName =
        user.name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "";
      if (fullName) setValue("fullName", fullName);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
      if (user.title || user.current_position?.name) {
        setValue(
          "currentPosition",
          user.current_position?.name || user.title || "",
        );
      }
      const userLoc =
        [user.city, user.country].filter(Boolean).join(", ") || user.location;
      if (userLoc) setValue("location", userLoc);
      if (user.linkedin_url || user.linkedin) {
        setValue("linkedinUrl", user.linkedin_url || user.linkedin || "");
      }
      if (user.portfolio_url || user.website || user.portfolio) {
        setValue(
          "portfolioUrl",
          user.portfolio_url || user.website || user.portfolio || "",
        );
      }
      if (user.about || user.bio) {
        setValue("aboutYourself", user.about || user.bio || "");
      }
      if (user.skills) {
        const skillsStr = Array.isArray(user.skills)
          ? user.skills
              .map((s: any) => (typeof s === "string" ? s : s.name))
              .join(", ")
          : user.skills;
        setValue("skills", skillsStr);
      }
    }
  }, [user, setValue]);

  // Register resume validation rule
  useEffect(() => {
    register("resume", {
      required: "Resume is required",
    });
  }, [register]);

  const handleSelectFile = (file: File | undefined | null) => {
    if (!file) return;

    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    setValue("resume", file, { shouldValidate: true });
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("resume", null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: CustomApplyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("application_type", "custom");
      formData.append("full_name", values.fullName || "");
      formData.append("email", values.email || "");
      formData.append("phone_number", values.phone || "");
      formData.append("experiences", values.experiences || "");
      formData.append("current_position", values.currentPosition || "");
      formData.append("expected_salary", values.expectedSalary || "");
      formData.append("location", values.location || "");
      formData.append("linkedin_url", values.linkedinUrl || "");
      formData.append("portfolio_url", values.portfolioUrl || "");
      formData.append("cover_letter", values.coverLetter || "");
      formData.append("about_yourself", values.aboutYourself || "");
      formData.append("skills", values.skills || "");
      if (values.resume) {
        formData.append("resume", values.resume);
      }

      if (jobId) {
        await applyUserJob({ id: jobId, data: formData }).unwrap();
      }

      toast.success("Application submitted successfully!");
      router.push(`/mu/jobs-details/${jobId}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application");
    }
  };

  if (isJobLoading) {
    return <DetailsSkeleton />;
  }

  const companyName = job?.industry?.name || "Betopia Group Limited";

  return (
    <div className="  pb-6 md:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: Job Overview ================= */}
        <div className="lg:col-span-5">
          <CustomJobApplyDetails job={job} />
        </div>

        {/* ================= RIGHT COLUMN: Application Form ================= */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 md:p-8 rounded-2xl border border-borderColor/80 shadow-xs">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-headerColor">
              Submit your application
            </h2>
            <p className="text-sm text-grayColor1 mt-1 mb-6">
              The following is required and will only be shared with{" "}
              {companyName}.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: Full name & Enter your email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReusableInput
                id="fullName"
                label="Full name"
                placeholder="Enter full name"
                error={errors.fullName?.message}
                {...register("fullName", { required: "Full name is required" })}
                className="rounded-lg h-11! md:h-12!"
              />
              <ReusableInput
                id="email"
                label="Enter email"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="rounded-lg h-11! md:h-12!"
              />
            </div>

            {/* Row 2: Phone number & Experiences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReusableInput
                id="phone"
                label="Phone number"
                type="tel"
                placeholder="Enter phone number"
                error={errors.phone?.message}
                {...register("phone")}
                className="rounded-lg h-11! md:h-12!"
              />
              <ReusableInput
                id="experiences"
                label="Experiences"
                placeholder="e.g., 1 years"
                error={errors.experiences?.message}
                {...register("experiences")}
                className="rounded-lg h-11! md:h-12!"
              />
            </div>

            {/* Row 3: Current Position, Expected Salary *, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReusableInput
                id="currentPosition"
                label="Current Position"
                placeholder="Enter current position"
                error={errors.currentPosition?.message}
                {...register("currentPosition")}
                className="rounded-lg h-11! md:h-12!"
              />
              <ReusableInput
                id="expectedSalary"
                label="Expected Salary"
                required
                type="number"
                placeholder="Enter expected salary"
                error={errors.expectedSalary?.message}
                {...register("expectedSalary", {
                  required: "Expected salary is required",
                })}
                className="rounded-lg h-11! md:h-12!"
              />
              <ReusableInput
                id="location"
                label="Location"
                placeholder="Enter Location"
                error={errors.location?.message}
                {...register("location")}
                className="rounded-lg h-11! md:h-12!"
              />
            </div>

            {/* Row 4: LinkedIn URL */}
            <ReusableInput
              id="linkedinUrl"
              label="LinkedIn URL"
              placeholder="Link to LinkedIn URL"
              error={errors.linkedinUrl?.message}
              {...register("linkedinUrl")}
              className="rounded-lg h-11! md:h-12!"
            />

            {/* Row 5: Portfolio URL */}
            <ReusableInput
              id="portfolioUrl"
              label="Portfolio URL"
              placeholder="Link to portfolio URL"
              error={errors.portfolioUrl?.message}
              {...register("portfolioUrl")}
              className="rounded-lg h-11! md:h-12!"
            />

            {/* Row 6: Cover Letter (JoditEditor) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-descriptionColor block">
                Cover Letter
              </label>
              <Controller
                name="coverLetter"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value || ""}
                    placeholder="Add a cover letter or anything else you want to share"
                    onChange={(content) => field.onChange(content)}
                    onBlur={() => field.onBlur()}
                  />
                )}
              />
              {errors.coverLetter && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            {/* Row 7: Tell us about your self (JoditEditor) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-descriptionColor block">
                Tell us about your self
              </label>
              <Controller
                name="aboutYourself"
                control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value || ""}
                    placeholder="Explain us about you."
                    onChange={(content) => field.onChange(content)}
                    onBlur={() => field.onBlur()}
                  />
                )}
              />
              {errors.aboutYourself && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.aboutYourself.message}
                </p>
              )}
            </div>

            {/* Row 8: Add your skills */}
            <ReusableInput
              id="skills"
              label="Add your skills"
              placeholder="Enter your skills separated by comma (,)."
              error={errors.skills?.message}
              {...register("skills")}
              className="rounded-lg h-11! md:h-12!"
            />

            {/* Row 9: Upload Resume/Curriculum Vitae * */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-descriptionColor block">
                Upload Resume/Curriculum Vitae{" "}
                <span className="text-redColor">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectFile(file);
                  e.target.value = "";
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleSelectFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border border-dashed py-8 px-4 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-primaryColor bg-primaryColor/5"
                    : errors.resume
                      ? "border-red-500 bg-red-50/20"
                      : "border-borderColor hover:border-primaryColor bg-white",
                )}
              >
                {resumeFile ? (
                  <div
                    className="flex items-center justify-between w-full max-w-md p-2.5 bg-gray-50 border border-borderColor rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-primaryColor shrink-0" />
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-medium text-headerColor truncate max-w-55 sm:max-w-75">
                          {resumeFile.name}
                        </p>
                        <p className="text-[11px] text-grayColor1">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-grayColor1 hover:text-red-500 p-1 rounded transition cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <CloudUpload
                      className="h-7 w-7 text-headerColor mb-2"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm text-descriptionColor">
                      Drag and drop your file, or{" "}
                      <span className="font-medium text-[#009da0] hover:underline">
                        choose here
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Support file: PDF, Word
                    </p>
                  </>
                )}
              </div>
              {errors.resume && (
                <p className="text-xs text-red-500">{errors.resume.message}</p>
              )}
            </div>

            {/* Row 10: Submit Application Button */}
            <div className="pt-2">
              <ButtonReuseable
                type="submit"
                className="w-full bg-primaryColor! px-4! py-2!"
                disabled={isSubmittingJob}
                title={isSubmittingJob ? "Submitting..." : "Submit Application"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomApplyForm;
