"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useCreateAdvertisementMutation,
  useGetAdvertisemetCategoriesQuery,
  useGetAdvertisemetEditeQuery,
  useGetAdvertisemetSectionQuery,
  useUpdateAdvertisementMutation,
} from "@/feature/slice/jobs/advertisementSlice";
import { cn } from "@/lib/utils";
import { CloudUpload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface AdvertisementFormData {
  product_name: string;
  network_type: string;
  industry_type: string;
  section_id: string;
  category_id: string;
  description: string;
  product_url: string;
  tags?: string;
  poc_name?: string;
  poc_email?: string;
  poc_phone?: string;
  information_confirmed: boolean;
}

interface CreateAdvertisementFormProps {
  id?: string;
  onSuccess?: () => void;
}

const networkOptions = [
  { value: "psychology", label: "Psychology Network" },
  { value: "neuroscience", label: "Neuroscience Network" },
];

const industryOptions = [
  { value: "biotechnology", label: "Biotechnology" },
  { value: "psychotropics", label: "Psychotropics" },
];

export default function CreateAdvertisementForm({
  id,
  onSuccess,
}: CreateAdvertisementFormProps) {
  const router = useRouter();

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdvertisementFormData>({
    defaultValues: {
      product_name: "",
      network_type: "psychology",
      industry_type: "biotechnology",
      section_id: "",
      category_id: "",
      description: "",
      product_url: "",
      tags: "",
      poc_name: "",
      poc_email: "",
      poc_phone: "",
      information_confirmed: false,
    },
  });

  const selectedNetworkType = watch("network_type");
  const selectedIndustryType = watch("industry_type");
  const selectedSectionId = watch("section_id");
  const watchedDescription = watch("description");

  // Section query params based on selected network_type & industry_type
  const sectionParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (selectedNetworkType) params.network_type = selectedNetworkType;
    if (selectedIndustryType) params.industry_type = selectedIndustryType;
    return params;
  }, [selectedNetworkType, selectedIndustryType]);

  // API Hooks
  const [createAdvertisement, { isLoading: isCreating }] =
    useCreateAdvertisementMutation();
  const [updateAdvertisement, { isLoading: isUpdating }] =
    useUpdateAdvertisementMutation();

  const { data: sectionData, isLoading: isSectionsLoading } =
    useGetAdvertisemetSectionQuery(sectionParams, {
      skip: !selectedNetworkType && !selectedIndustryType,
    });
  const { data: editResponse } = useGetAdvertisemetEditeQuery(id, {
    skip: !id,
  });

  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Format section options for CreatableSelectField with fallback for edit mode
  const sectionOptions = useMemo(() => {
    const list = sectionData?.data || [];
    const mapped = Array.isArray(list)
      ? list.map((sec: any) => ({
          value: String(sec.id),
          label: sec.name,
        }))
      : [];

    const ad = editResponse?.data || editResponse;
    if (
      ad?.section_id &&
      !mapped.some((item: any) => String(item.value) === String(ad.section_id))
    ) {
      mapped.unshift({
        value: String(ad.section_id),
        label: ad.section_name || String(ad.section_id),
      });
    }
    return mapped;
  }, [sectionData, editResponse]);

  // Find actual numeric ID if section was selected
  const selectedSectionObj = useMemo(() => {
    const list = sectionData?.data || [];
    if (!Array.isArray(list)) return null;
    return list.find(
      (s: any) =>
        String(s.id) === String(selectedSectionId) ||
        s.name?.toLowerCase() === selectedSectionId?.toLowerCase(),
    );
  }, [sectionData, selectedSectionId]);

  const sectionQueryId =
    selectedSectionObj?.id ??
    (selectedSectionId && !isNaN(Number(selectedSectionId))
      ? selectedSectionId
      : undefined);

  // Fetch categories dependent on selected section
  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetAdvertisemetCategoriesQuery(sectionQueryId, {
      skip: !sectionQueryId,
    });

  // Format category options for CreatableSelectField with fallback for edit mode
  const categoryOptions = useMemo(() => {
    const raw = categoryData?.data;
    const list = Array.isArray(raw?.categories)
      ? raw.categories
      : Array.isArray(raw)
        ? raw
        : [];
    const mapped = list.map((cat: any) => ({
      value: String(cat.id),
      label: cat.category_name || cat.name || String(cat),
    }));

    const ad = editResponse?.data || editResponse;
    if (
      ad?.category_id &&
      !mapped.some((item: any) => String(item.value) === String(ad.category_id))
    ) {
      mapped.unshift({
        value: String(ad.category_id),
        label: ad.category_name || String(ad.category_id),
      });
    }
    return mapped;
  }, [categoryData, editResponse]);

  // Populate data when editing
  useEffect(() => {
    const ad = editResponse?.data || editResponse;
    if (!ad || !id) return;

    reset({
      product_name: ad.product_name || "",
      network_type: ad.network_type || "psychology",
      industry_type: ad.industry_type || "biotechnology",
      section_id: ad.section_id ? String(ad.section_id) : "",
      category_id: ad.category_id ? String(ad.category_id) : "",
      description: ad.description || ad.short_description || "",
      product_url: ad.product_url || "",
      tags: Array.isArray(ad.tags) ? ad.tags.join(", ") : ad.tags || "",
      poc_name: ad.poc_name || ad.contact_name || "",
      poc_email: ad.poc_email || ad.contact_email || "",
      poc_phone: ad.poc_phone || ad.contact_phone || "",
      information_confirmed: Boolean(
        ad.information_confirmed ?? ad.review_confirmed ?? ad.is_confirmed,
      ),
    });

    if (ad.image_url) {
      setImagePreview(ad.image_url);
    } else if (ad.image) {
      setImagePreview(
        ad.image.startsWith("http")
          ? ad.image
          : `https://vini.pixelstack.cloud/storage/${ad.image}`,
      );
    }
  }, [editResponse, id, reset]);

  // Image handling
  const handleImageFile = (file?: File) => {
    if (!file) return;
    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, or WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
      return;
    }

    setImageError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset / Start over handler
  const handleStartOver = () => {
    reset({
      product_name: "",
      network_type: "psychology",
      industry_type: "biotechnology",
      section_id: "",
      category_id: "",
      description: "",
      product_url: "",
      tags: "",
      poc_name: "",
      poc_email: "",
      poc_phone: "",
      information_confirmed: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form Submit
  const onSubmit = async (data: AdvertisementFormData) => {
    if (!imageFile && !imagePreview) {
      setImageError("Product image is required");
      toast.error("Please upload a product image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_name", data.product_name);
      formData.append("network_type", data.network_type);
      formData.append("industry_type", data.industry_type);
      formData.append("section_id", String(data.section_id));
      formData.append("category_id", String(data.category_id));
      formData.append("description", data.description);
      formData.append("product_url", data.product_url);

      if (data.tags) {
        formData.append("tags", data.tags);
      }
      if (data.poc_name) {
        formData.append("poc_name", data.poc_name);
        formData.append("contact_name", data.poc_name);
      }
      if (data.poc_email) {
        formData.append("poc_email", data.poc_email);
        formData.append("contact_email", data.poc_email);
      }
      if (data.poc_phone) {
        formData.append("poc_phone", data.poc_phone);
        formData.append("contact_phone", data.poc_phone);
      }

      formData.append(
        "information_confirmed",
        data.information_confirmed ? "1" : "0",
      );
      formData.append(
        "review_confirmed",
        data.information_confirmed ? "1" : "0",
      );
      formData.append("is_confirmed", data.information_confirmed ? "1" : "0");

      if (imageFile) {
        formData.append("image", imageFile);
        formData.append("product_image", imageFile);
      }

      if (id) {
        formData.append("_method", "PUT");
        await updateAdvertisement({ id, data: formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createAdvertisement(formData).unwrap();
        toast.success("Product created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/mu/products");
      }
    } catch (error: any) {
      console.error("Error submitting Product:", error);
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(
          serverErrors,
        ).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        toast.error(
          error?.data?.message || "Failed to submit Product. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-headerColor">
          {id ? "Edit Product " : "Add Product "}
        </h1>
        <p className="text-sm text-descriptionColor mt-1">
          Add information about your product to help our team review and publish
          your advertisement accurately.
        </p>
        <div className="border-b border-borderColor/60 mt-4" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Name */}
        <ReusableInput
          id="product_name"
          label="Product Name"
          required
          placeholder="Enter your product name"
          className="rounded-lg border-borderColor text-sm text-headerColor"
          error={errors.product_name?.message}
          {...register("product_name", {
            required: "Product name is required",
          })}
        />

        {/* Network Type & Industry Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label
              htmlFor="network_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Network Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="network_type"
              rules={{ required: "Network type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`network-${field.value || "empty"}`}
                  id="network_type"
                  value={field.value || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("section_id", "");
                    setValue("category_id", "");
                  }}
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
              htmlFor="industry_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Industry Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="industry_type"
              rules={{ required: "Industry type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`industry-${field.value || "empty"}`}
                  id="industry_type"
                  value={field.value || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("section_id", "");
                    setValue("category_id", "");
                  }}
                  placeholder="Select Industry"
                  options={industryOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.industry_type && (
              <p className="text-redColor text-xs">
                {errors.industry_type.message}
              </p>
            )}
          </div>
        </div>

        {/* Select a Section & Select a Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Label
              htmlFor="section_id"
              className="text-sm text-descriptionColor font-medium"
            >
              Select a Section <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="section_id"
              rules={{ required: "Section is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  key={`section-select-${selectedNetworkType || "none"}-${selectedIndustryType || "none"}`}
                  value={field.value || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("category_id", "");
                  }}
                  options={sectionOptions}
                  placeholder={
                    isSectionsLoading
                      ? "Loading sections..."
                      : !selectedNetworkType && !selectedIndustryType
                        ? "Select Network & Industry first"
                        : "Select a Section"
                  }
                  isDisabled={
                    isSectionsLoading ||
                    (!selectedNetworkType && !selectedIndustryType)
                  }
                  allowCustomInput
                  className="w-full"
                />
              )}
            />
            {errors.section_id && (
              <p className="text-redColor text-xs">
                {errors.section_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="category_id"
              className="text-sm text-descriptionColor font-medium"
            >
              Select a Category <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="category_id"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  key={`category-select-${selectedSectionId || "none"}`}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={categoryOptions}
                  placeholder={
                    !selectedSectionId
                      ? "Select a Section first"
                      : isCategoriesLoading
                        ? "Loading categories..."
                        : "Select a Category"
                  }
                  isDisabled={!selectedSectionId || isCategoriesLoading}
                  allowCustomInput
                  className="w-full"
                />
              )}
            />
            {errors.category_id && (
              <p className="text-redColor text-xs">
                {errors.category_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="text-sm text-descriptionColor font-medium"
          >
            Detailed Description <span className="text-redColor">*</span>
          </Label>
          <div
            className={cn(
              "overflow-hidden rounded-lg border",
              errors.description ? "border-redColor" : "border-borderColor",
            )}
          >
            <Controller
              name="description"
              control={control}
              rules={{
                validate: (value) => {
                  const plainText = value
                    .replace(/<[^>]*>/g, " ")
                    .replace(/&nbsp;/g, " ")
                    .trim();

                  if (!plainText) {
                    return "Detailed description is required";
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <JoditEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Describe the product, its purpose, benefits, and key features."
                />
              )}
            />
          </div>
          <div className="flex  items-center text-xs">
            {errors.description && (
              <p className="text-redColor">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Product URL */}
        <ReusableInput
          id="product_url"
          label="Product URL"
          required
          placeholder="https://www.product.com/product1"
          className="rounded-lg border-borderColor text-sm text-headerColor"
          error={errors.product_url?.message}
          {...register("product_url", {
            required: "Product URL is required",
          })}
        />

        {/* Upload Product Image */}
        <div className="space-y-1.5">
          <Label className="text-sm text-descriptionColor font-medium">
            Upload Product Image <span className="text-redColor">*</span>
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              handleImageFile(e.target.files?.[0]);
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
              handleImageFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors",
              isDragging
                ? "border-primaryColor bg-primaryColor/5"
                : "border-gray-300 bg-white hover:border-primaryColor",
              (imageError || errors.product_name) && !imagePreview
                ? "border-gray-300"
                : "",
              imageError && "border-redColor",
            )}
          >
            {imagePreview ? (
              <div className="relative group flex flex-col items-center justify-center">
                <div className="relative w-36 h-28 rounded-lg overflow-hidden border border-borderColor shadow-xs">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1.5 right-1.5 p-1 bg-redColor text-white rounded-full hover:bg-redColor/80 transition-colors cursor-pointer shadow-sm"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-descriptionColor font-medium mt-2 max-w-xs truncate">
                  {imageFile?.name || "Uploaded Product Image"}
                </p>
                <p className="text-xs text-primaryColor font-medium mt-0.5">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
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
              </div>
            )}
          </div>
          {imageError && (
            <p className="text-redColor text-xs mt-1">{imageError}</p>
          )}
        </div>

        {/* Add Tags */}
        <ReusableInput
          id="tags"
          label="Add Tags"
          placeholder="e.g., Biotechnology, Psychotropics, Publications"
          className="rounded-lg border-borderColor text-sm text-headerColor"
          error={errors.tags?.message}
          {...register("tags")}
        />

        {/* Person of Contact */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm md:text-base font-semibold text-headerColor">
            Person of Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <ReusableInput
              id="poc_name"
              label="Name"
              placeholder="e.g., Sheikh Muhammad Ashik"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.poc_name?.message}
              {...register("poc_name")}
            />
            <ReusableInput
              id="poc_email"
              type="email"
              label="Email"
              placeholder="e.g., smashik@company.com"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.poc_email?.message}
              {...register("poc_email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <ReusableInput
              id="poc_phone"
              type="tel"
              label="Phone Number"
              placeholder="e.g., +1 234 5678 87"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.poc_phone?.message}
              {...register("poc_phone")}
            />
          </div>
        </div>

        {/* Review Before Publishing */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-semibold text-headerColor">
            Review Before Publishing
          </h3>
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="information_confirmed"
              rules={{
                required:
                  "You must confirm that all submitted information is accurate",
                validate: (v) =>
                  v === true ||
                  "You must confirm that all submitted information is accurate",
              }}
              render={({ field }) => (
                <Checkbox
                  id="information_confirmed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5 border border-primaryColor data-[state=checked]:bg-primaryColor data-[state=checked]:text-white data-[state=checked]:border-primaryColor rounded"
                />
              )}
            />
            <label
              htmlFor="information_confirmed"
              className="text-xs md:text-sm text-descriptionColor leading-snug cursor-pointer select-none"
            >
              I confirm that all submitted information is accurate and that I
              have permission to advertise this product.
            </label>
          </div>
          {errors.information_confirmed && (
            <p className="text-redColor text-xs">
              {errors.information_confirmed.message}
            </p>
          )}
        </div>

        {/* Buttons: Start over & Submit */}
        <div className="flex items-center justify-center gap-4 pt-4 pb-2">
          <button
            type="button"
            onClick={handleStartOver}
            className="px-8 py-2.5 rounded-full border border-primaryColor text-primaryColor font-medium text-sm hover:bg-primaryColor/5 transition-colors cursor-pointer"
          >
            Start over
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isCreating || isUpdating}
            className="px-10 py-2.5 rounded-full bg-primaryColor text-white font-medium text-sm hover:bg-primaryColor/90 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isSubmitting || isCreating || isUpdating ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : id ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
