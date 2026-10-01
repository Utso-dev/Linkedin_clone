"use client";

import Breadcrumb from "@/app/(Frond-End)/_components/Breadcrumb";
import ButtonReuseable from "@/components/reusable/CustomButton";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from "@/feature/slice/companySlice";
import emptyUser from "@/public/empty_user.jpg";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CompanyFormData {
  name: string;
  address: string;
  website: string;
  industry: string;
  company_size: string;
  tagline: string;
  logo: File | null;
  description: string;
  cover_image: File | null;
  authorization_confirmed: boolean;
}

interface CompanyData {
  id: number;
  name: string;
  address: string;
  website: string;
  industry: string;
  company_size: string;
  tagline: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
}

const companySizeOptions = [
  { value: "1 - 10", label: "1 - 10" },
  { value: "10 - 100", label: "10 - 100" },
  { value: "100 - 1000", label: "100 - 1000" },
  { value: "1000 - 5000", label: "1000 - 5000" },
  { value: "5000+", label: "5000+" },
];
const industryOptions = [
  { value: "biotechnology", label: "Biotechnology" },
  { value: "psychotropics", label: "Psychotropics" },
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export default function CreateCompanyPage({ UId }: { UId?: string }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    defaultValues: {
      name: "",
      address: "",
      website: "",
      industry: "",
      company_size: "",
      description: "",
      tagline: "",
      logo: null,
      cover_image: null,
      authorization_confirmed: false,
    },
  });
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const { data } = useGetCompanyQuery(UId, {
    skip: !UId,
  });
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    const company = (data?.data ?? data) as CompanyData | undefined;
    if (!company) return;

    const industry =
      industryOptions.find(
        (option) =>
          option.value.toLowerCase() === company.industry?.trim().toLowerCase(),
      )?.value || "";
    const companySize =
      companySizeOptions.find(
        (option) =>
          option.value.toLowerCase() ===
          company.company_size?.trim().toLowerCase(),
      )?.value || "";

    reset({
      name: company.name || "",
      address: company.address || "",
      website: company.website || "",
      industry,
      company_size: companySize,
      tagline: company.tagline || "",
      description: company.description || "",
      logo: null,
      cover_image: null,
      authorization_confirmed: false,
    });
    setValue("industry", industry, { shouldValidate: true });
    setValue("company_size", companySize, { shouldValidate: true });
    setLogoPreview(company.logo || null);
    setCoverPreview(company.cover_image || null);
  }, [data, reset, setValue, UId]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  // Watch form fields for live preview
  const watchedName = watch("name");
  const watchedAddress = watch("address");
  const watchedDescription = watch("description");
  const watchedTagline = watch("tagline");
  const watchedSize = watch("company_size");

  // Handle Logo Upload
  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Logo must be JPG, PNG, or WEBP");
      return;
    }
    setValue("logo", file, { shouldValidate: true });
    setLogoPreview(URL.createObjectURL(file));
  };

  // Handle Cover Upload
  const handleCoverFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Cover image must be JPG, PNG, or WEBP");
      return;
    }
    setValue("cover_image", file, { shouldValidate: true });
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("logo", null, { shouldValidate: true });
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const removeCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("cover_image", null, { shouldValidate: true });
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (!UId && !data.logo) {
      toast.error("Please upload a logo image");
      return;
    }
    if (!UId && !data.cover_image) {
      toast.error("Please upload a cover image");
      return;
    }
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("address", data.address);
    payload.append("website", data.website);
    payload.append("industry", data.industry);
    payload.append("company_size", data.company_size);
    payload.append("tagline", data.tagline);
    payload.append("description", data.description);
    if (data.logo) {
      payload.append("logo", data.logo);
    }
    if (data.cover_image) {
      payload.append("cover_image", data.cover_image);
    }
    payload.append(
      "authorization_confirmed",
      String(data.authorization_confirmed),
    );
    if (UId) {
      payload.append("id", UId);
    }
    let response;
    try {
      if (UId) {
        response = await updateCompany(payload).unwrap();
        toast.success("Company page updated successfully!");
      } else {
        response = await createCompany(payload).unwrap();
        toast.success("Company page created successfully!");
      }
      console.log(response, " response");

      router.push(`/mu/industry-profile/${UId || response?.data?.id}`);
    } catch (error) {
      console.error("Error creating company:", error);
      setErrorMessage(
        error?.data?.message ||
          "Failed to create company page. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen pb-8 pt-4 lg:by-12">
      <div className="container">
        <div className="mb-6 md:mb-8">
          <Breadcrumb />
          <h1 className="text-xl md:text-2xl text-center font-bold text-headerColor">
            Create a Company Page For Mind Unite
          </h1>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Name */}
                <ReusableInput
                  id="name"
                  label="Company Name"
                  required
                  placeholder="Add your company name"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors?.name?.message}
                  {...register("name", {
                    required: "Company name is required",
                  })}
                />

                {/* Company Address */}
                <ReusableInput
                  id="address"
                  label="Add your company address"
                  required
                  placeholder="www.mindunite/company/your-company-name"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.address?.message}
                  {...register("address", {
                    required: "Company address is required",
                  })}
                />

                {/* Website */}
                <ReusableInput
                  id="website"
                  label="Website"
                  required
                  placeholder="www.yourcompany.com"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.website?.message}
                  {...register("website", {
                    required: "Website is required",
                  })}
                />

                {/* Company Size */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company_size"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Industry <span className="text-redColor">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="industry"
                    rules={{ required: "industry  is required" }}
                    render={({ field }) => (
                      <SelecteInputField
                        key={`industry-${field.value || "empty"}`}
                        id="industry"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Ex: Information & Technology Service"
                        options={industryOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                  {errors.industry && (
                    <p className="text-redColor text-xs">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
                {/* Company Size */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company_size"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Company Size <span className="text-redColor">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="company_size"
                    rules={{ required: "Company size is required" }}
                    render={({ field }) => (
                      <SelecteInputField
                        key={`company-size-${field.value || "empty"}`}
                        id="company_size"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Select Company Size"
                        options={companySizeOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                  {errors.company_size && (
                    <p className="text-redColor text-xs">
                      {errors.company_size.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  {/* Description */}
                  <Label
                    htmlFor="description"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Description <span className="text-redColor">*</span>
                  </Label>
                  <ReusableTextarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    placeholder="Add your company description"
                    className="w-full border border-borderColor text-sm text-headerColor rounded-sm p-3"
                    error={errors.description?.message}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                </div>

                {/* Upload Logo Image */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-descriptionColor font-medium">
                    Upload Logo Image <span className="text-redColor">*</span>
                  </Label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      handleLogoFile(e.target.files?.[0]);
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsLogoDragging(true);
                    }}
                    onDragLeave={() => setIsLogoDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsLogoDragging(false);
                      handleLogoFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => logoInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
                      isLogoDragging
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-gray-300 bg-white hover:border-primaryColor"
                    }`}
                  >
                    {logoPreview ? (
                      <div className="relative group flex flex-col items-center">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-xs mb-2"
                        />
                        <p className="text-xs text-descriptionColor font-medium mb-1">
                          Click to change image
                        </p>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-1 -right-4 p-1 bg-redColor/10 hover:bg-redColor text-redColor hover:text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="mb-2 h-7 w-7 text-gray-500" />
                        <p className="text-sm text-descriptionColor">
                          Drag and drop your file, or{" "}
                          <span className="font-medium text-primaryColor">
                            choose here
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Support file: JPG, PNG or WEBP
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Upload Cover Image */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-descriptionColor font-medium">
                    Upload Cover Image <span className="text-redColor">*</span>
                  </Label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      handleCoverFile(e.target.files?.[0]);
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(true);
                    }}
                    onDragLeave={() => setIsCoverDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(false);
                      handleCoverFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => coverInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
                      isCoverDragging
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-gray-300 bg-white hover:border-primaryColor"
                    }`}
                  >
                    {coverPreview ? (
                      <div className="relative group w-full max-w-xs flex flex-col items-center">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-24 rounded-lg object-cover border border-gray-200 shadow-xs mb-2"
                        />
                        <p className="text-xs text-descriptionColor font-medium mb-1">
                          Click to change image
                        </p>
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute -top-1 -right-2 p-1 bg-redColor/10 hover:bg-redColor text-redColor hover:text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="mb-2 h-7 w-7 text-gray-500" />
                        <p className="text-sm text-descriptionColor">
                          Drag and drop your file, or{" "}
                          <span className="font-medium text-primaryColor">
                            choose here
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Support file: JPG, PNG or WEBP
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <ReusableInput
                  id="tagline"
                  label="Tagline"
                  required
                  placeholder="ex: An information services firm helping small businesses succeed."
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.tagline?.message}
                  {...register("tagline", {
                    required: "Tagline is required",
                  })}
                />

                {/* Verification Checkbox */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-start gap-3">
                    <Controller
                      control={control}
                      name="authorization_confirmed"
                      rules={{
                        required:
                          "You must verify that you are an authorized representative",
                      }}
                      render={({ field }) => (
                        <Checkbox
                          id="authorization_confirmed"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-gray-400 data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor rounded"
                        />
                      )}
                    />
                    <label
                      htmlFor="authorization_confirmed"
                      className="text-xs md:text-[13px] text-gray-500 leading-snug cursor-pointer select-none"
                    >
                      I verify that I am an authorized representative of this
                      organization and have the right to act on its behalf in
                      the creation and management of this page. The organization
                      and I agree to the additional terms for Pages.
                    </label>
                  </div>
                  {errors.authorization_confirmed && (
                    <p className="text-redColor text-xs">
                      {errors.authorization_confirmed.message}
                    </p>
                  )}
                </div>
                {errorMessage && (
                  <div className="text-center">
                    <p className="text-redColor text-base">{errorMessage}</p>
                    <Link
                      className=" px-4 py-2 rounded-sm text-primaryColor underline "
                      href="/mu/subscription?billing=monthly"
                    >
                      Go to Subscription
                    </Link>
                  </div>
                )}

                <ButtonReuseable
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  sendingMsg={UId ? "Updating..." : "Creating..."}
                  className="w-full"
                  title={<div>{UId ? "Update Page" : "Create Page"}</div>}
                />
              </form>
            </div>

            {/* Right Column: Live Preview Card */}
            <div className="lg:col-span-5 sticky top-29">
              <div className=" overflow-hidden shadow-xs">
                {/* Cover Banner */}
                <div className="relative h-44 md:h-48 w-full bg-linear-to-r from-cyan-100 to-blue-200 overflow-hidden">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Company Cover"
                      className="w-full h-full object-cover"
                      width={400}
                      height={292}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-cyan-100 to-blue-200" />
                  )}
                </div>

                {/* Avatar / Logo */}
                <div className="px-6 relative">
                  <div className="relative -mt-11 md:-mt-12 w-20 h-20 md:w-22 md:h-22 rounded-full border-2 border-white shadow-sm overflow-hidden bg-primaryColor flex items-center justify-center">
                    <Image
                      src={logoPreview || emptyUser}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                      width={400}
                      height={292}
                    />
                  </div>
                </div>

                {/* Info Details */}
                <div className="px-6 pt-3 pb-8 space-y-1">
                  <h3 className="text-xl font-bold text-headerColortracking-tight">
                    {watchedName.trim() ? watchedName : "Company Name"}
                  </h3>
                  <p className="text-sm text-descriptionColor font-normal">
                    {watchedTagline.trim() ? watchedTagline : "Tagline"}
                  </p>
                  <p className="text-xs text-descriptionColor font-normal pt-1">
                    {watchedAddress.trim() ? watchedAddress : "Location"}
                  </p>
                  <p className="text-xs text-descriptionColor font-normal">
                    {watchedSize.trim()
                      ? `${watchedSize} employees`
                      : "Company Size"}
                  </p>

                  {/* Bottom Divider */}
                  <div className="border-t border-borderColor pt-3 mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
