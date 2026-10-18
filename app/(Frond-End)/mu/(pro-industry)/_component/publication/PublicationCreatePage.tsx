"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useGetSinglePublicationQuery,
  usePublicationCreateMutation,
  usePublicationUpdateMutation,
} from "@/feature/slice/jobs/publicationSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { CloudUpload, FileText, Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type PublicationCreatePageProps = {
  id?: string;
};

export type PublicationFormData = {
  publication_type: string;
  network_type: string;
  title: string;
  abstract: string;
  authors: string[];
  website_url: string;
  status: string;
  information_confirmed: boolean;
};

const networkOptions = [
  { value: "psychology", label: "Psychology" },
  { value: "neuroscience", label: "Neuroscience" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" },
];

const defaultValues: PublicationFormData = {
  publication_type: "",
  network_type: "psychology",
  title: "",
  abstract: "",
  authors: [],
  website_url: "",
  status: "active",
  information_confirmed: false,
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getEditorText = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function PublicationCreatePage({
  id,
}: PublicationCreatePageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPublication, { isLoading: isCreating }] =
    usePublicationCreateMutation();
  const [updatePublication, { isLoading: isUpdating }] =
    usePublicationUpdateMutation();

  const { data: singleResponse, isLoading: isPublicationLoading } =
    useGetSinglePublicationQuery(id!, { skip: !id });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [existingAttachmentName, setExistingAttachmentName] = useState("");
  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const isPremium = userProfileData?.subscription?.plan_type === "premium";
  const publicationOptions = useMemo(() => {
    const baseOptions = isPremium
      ? [
          { value: "university", label: "University Publications" },
          { value: "freelance", label: "Freelance Publications" },
          { value: "other", label: "Other Publications" },
        ]
      : [{ value: "professional", label: "Professional Publications" }];

    const existingType = singleResponse?.data?.publication_type;
    if (
      existingType &&
      !baseOptions.some(
        (opt) => opt.value.toLowerCase() === existingType.trim().toLowerCase(),
      )
    ) {
      const label =
        existingType.toLowerCase() === "professional"
          ? "Professional Publications"
          : `${existingType.charAt(0).toUpperCase() + existingType.slice(1)} Publications`;
      return [...baseOptions, { value: existingType, label }];
    }
    return baseOptions;
  }, [isPremium, singleResponse?.data?.publication_type]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormData>({
    defaultValues,
    mode: "onTouched",
  });

  // Populate data when in edit mode
  useEffect(() => {
    const publication = singleResponse?.data;
    if (!publication || !id) return;

    const publication_type =
      publicationOptions.find(
        (option) =>
          option.value.toLowerCase() ===
          publication.publication_type?.trim().toLowerCase(),
      )?.value || publication.publication_type || "";

    const network_type =
      networkOptions.find(
        (option) =>
          option.value.toLowerCase() ===
          publication.network_type?.trim().toLowerCase(),
      )?.value || publication.network_type || "";

    reset({
      publication_type,
      network_type,
      title: publication.title || "",
      abstract: publication.abstract || publication.short_abstract || "",
      authors: Array.isArray(publication.authors) ? publication.authors : [],
      website_url: publication.website_url || "",
      status: publication.status || "active",
      information_confirmed: Boolean(publication.information_confirmed),
    });
    setValue("publication_type", publication_type, {
      shouldValidate: true,
    });
    setValue("network_type", network_type, {
      shouldValidate: true,
    });

    if (publication.attachment) {
      setExistingAttachmentName(
        String(publication.attachment).split("/").pop() || "Current Document",
      );
      setExistingAttachmentUrl(publication.attachment_url || "");
    }
  }, [singleResponse, id, setValue, reset, publicationOptions]);

  // Set default values in create mode
  useEffect(() => {
    if (id) return;
    const defaultType = isPremium ? "university" : "professional";
    setValue("publication_type", defaultType, { shouldValidate: true });
    setValue("network_type", "psychology", { shouldValidate: true });
  }, [id, isPremium, setValue]);

  const validateAndSetFile = (file?: File) => {
    if (!file) return;

    const validExtensions = [".pdf", ".docx"];
    const validMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );
    const isMimeValid = validMimes.includes(file.type);

    if (!isExtensionValid && !isMimeValid) {
      setFileError("Please upload a valid PDF or DOCX file.");
      toast.error("Please upload a valid PDF or DOCX file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError("File size exceeds 25 MB limit.");
      toast.error("File size exceeds 25 MB limit.");
      return;
    }

    setAttachment(file);
    setFileError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAttachment(null);
    setExistingAttachmentName("");
    setExistingAttachmentUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PublicationFormData) => {
    // Validate file attachment
    if (!attachment && !existingAttachmentUrl) {
      setFileError("Please upload a PDF or DOCX file.");
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }

    const formData = new FormData();
    formData.append("network_type", data.network_type);
    formData.append("publication_type", data.publication_type);
    formData.append("title", data.title.trim());
    formData.append("abstract", data.abstract.trim());
    formData.append(
      "authors",
      JSON.stringify(data.authors.map((a) => a.trim())),
    );
    formData.append("website_url", data.website_url.trim());
    formData.append("status", data.status);
    formData.append(
      "information_confirmed",
      data.information_confirmed ? "1" : "0",
    );

    if (attachment) {
      formData.append("attachment", attachment);
    }

    if (id) {
      formData.append("_method", "PUT");
    }

    try {
      if (id) {
        await updatePublication({ id, body: formData }).unwrap();
        toast.success("Publication updated successfully.");
      } else {
        await createPublication(formData).unwrap();
        toast.success("Publication created successfully.");
      }
      if (isPremium) {
        router.push("/mu/premium/publications");
      } else {
        router.push("/mu/publications");
      }
    } catch (error: any) {
      const serverErrors = error?.data?.errors;
      const firstError =
        serverErrors && typeof serverErrors === "object"
          ? Object.values(serverErrors).flat()[0]
          : null;
      toast.error(
        String(
          firstError || error?.data?.message || "Failed to save publication.",
        ),
      );
    }
  };

  if (isPublicationLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-descriptionColor">
          <Loader className="h-6 w-6 animate-spin text-primaryColor" />
          <span>Loading publication details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  pb-4 px-2 sm:px-0">
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-headerColor md:text-2xl">
          {id ? "Edit Publication" : "Create Publication"}
        </h1>
        <p className="mt-1 text-sm text-descriptionColor">
          Complete the information below to publish a professional publication.
        </p>
        <div className="mt-4 border-b border-borderColor/60" />
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Publication Category & Network Type */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="space-y-1.5">
            <Label
              htmlFor="publication_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Publication Category <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="publication_type"
              rules={{ required: "Publication category is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`publication_type-${field.value || "empty"}`}
                  id="publication_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Category"
                  options={publicationOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.publication_type && (
              <p className="text-red-500 text-xs">
                {errors.publication_type.message}
              </p>
            )}
          </div>

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
                  key={`network_type-${field.value || "empty"}`}
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
              <p className="text-red-500 text-xs">
                {errors.network_type.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Publication Title */}
        <ReusableInput
          id="title"
          label="Publication Title"
          required
          placeholder="e.g., Clinical Insights on Cognitive Behavioral Therapy"
          className="rounded-lg text-sm text-headerColor"
          error={errors.title?.message}
          {...register("title", {
            required: "Publication title is required",
          })}
        />

        {/* Row 3: Abstract (JoditEditor) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="abstract"
            className="text-sm text-descriptionColor font-medium"
          >
            Abstract <span className="text-redColor">*</span>
          </Label>
          <Controller
            control={control}
            name="abstract"
            rules={{
              validate: (value) => {
                const text = getEditorText(value || "");
                if (!text) return "Abstract is required";
                return true;
              },
            }}
            render={({ field }) => (
              <JoditEditor
                value={field.value || ""}
                placeholder="Describe the abstract of your publication..."
                height={260}
                onChange={(content) => field.onChange(content)}
                onBlur={() => field.onBlur()}
              />
            )}
          />
          {errors.abstract && (
            <p className="text-red-500 text-xs">{errors.abstract.message}</p>
          )}
        </div>

        {/* Row 4: Authors (Creatable Multi Select) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="authors"
            className="text-sm text-descriptionColor font-medium"
          >
            Authors <span className="text-redColor">*</span>
          </Label>
          <Controller
            control={control}
            name="authors"
            rules={{
              required: "At least one author is required",
              validate: (val) =>
                (Array.isArray(val) && val.length > 0) ||
                "At least one author is required",
            }}
            render={({ field }) => (
              <CreatableSelectField
                placeholder="Type author name and press Enter..."
                values={field.value || []}
                onChangeValues={field.onChange}
                options={(field.value || []).map((name: string) => ({
                  value: name,
                  label: name,
                }))}
                isMulti
                allowCustomInput
                className="w-full text-sm"
              />
            )}
          />
          <p className="text-xs text-descriptionColor/70">
            Type author name and press Enter or select &ldquo;Create&rdquo; to
            add. Multiple authors are supported.
          </p>
          {errors.authors && (
            <p className="text-red-500 text-xs">{errors.authors.message}</p>
          )}
        </div>

        {/* Row 5: Reference Website & Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <ReusableInput
            id="website_url"
            label="Reference Website"
            required
            placeholder="www.example.com"
            className="rounded-lg text-sm text-headerColor"
            error={errors.website_url?.message}
            {...register("website_url", {
              required: "Reference website URL is required",
            })}
          />

          <div className="space-y-1.5">
            <Label
              htmlFor="status"
              className="text-sm text-descriptionColor font-medium"
            >
              Status
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelecteInputField
                  id="status"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Status"
                  options={statusOptions}
                  className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                />
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-xs">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Row 6: Upload PDF or Docx File */}
        <div className="space-y-2">
          <Label className="text-sm text-descriptionColor font-medium">
            Upload PDF or DOCX File <span className="text-redColor">*</span>
          </Label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex min-h-28 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-6 text-sm transition-all cursor-pointer select-none ${
              isDragging
                ? "border-primaryColor bg-primaryColor/5"
                : "border-borderColor hover:border-primaryColor bg-white"
            } ${fileError ? "border-red-400 bg-red-50/20" : ""}`}
          >
            {attachment || existingAttachmentName ? (
              <div className="relative flex w-full flex-col items-center justify-center text-center">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-3 -right-3 p-1.5 rounded-full bg-gray-100 hover:bg-red-50 text-descriptionColor hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 rounded-full bg-primaryColor/10 flex items-center justify-center text-primaryColor mb-1">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-primaryColor truncate max-w-xs sm:max-w-md">
                  {attachment?.name || existingAttachmentName}
                </p>
                <p className="text-xs text-descriptionColor/80">
                  {attachment
                    ? formatFileSize(attachment.size)
                    : "Attached document"}
                </p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-primaryColor/10 flex items-center justify-center text-primaryColor mb-1">
                  <CloudUpload className="h-5 w-5" />
                </div>
                <p className="text-sm text-headerColor">
                  Drag and drop your file, or{" "}
                  <span className="font-semibold text-primaryColor">
                    choose file
                  </span>
                </p>
                <p className="text-xs text-descriptionColor/80">
                  Supported formats: PDF or DOCX (Max 25 MB)
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          />

          {fileError && (
            <p className="text-red-500 text-xs mt-1">{fileError}</p>
          )}
        </div>

        {/* Row 7: Review Before Publishing */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-semibold text-headerColor">
            Review Before Publishing
          </h3>
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="information_confirmed"
              rules={{
                required: "You must confirm the publication information",
                validate: (v) =>
                  v === true || "You must confirm the publication information",
              }}
              render={({ field }) => (
                <Checkbox
                  id="information_confirmed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5 border-primaryColor data-[state=checked]:bg-primaryColor data-[state=checked]:text-white data-[state=checked]:border-0 rounded"
                />
              )}
            />
            <label
              htmlFor="information_confirmed"
              className="text-xs md:text-sm text-descriptionColor leading-snug cursor-pointer select-none"
            >
              I confirm that all information provided is accurate and that I am
              authorized to publish this publication on behalf of my
              organization.
            </label>
          </div>
          {errors.information_confirmed && (
            <p className="text-red-500 text-xs">
              {errors.information_confirmed.message}
            </p>
          )}
        </div>

        {/* Row 8: Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4 pb-2">
          <button
            type="button"
            onClick={() => router.push("/mu/publications")}
            className="px-8 py-2.5 rounded-full border border-primaryColor text-primaryColor font-medium text-sm hover:bg-primaryColor/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isCreating || isUpdating}
            className="px-10 py-2.5 rounded-full bg-primaryColor text-white font-medium text-sm hover:bg-primaryColor/90 transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-2"
          >
            {isSubmitting || isCreating || isUpdating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{id ? "Updating..." : "Posting..."}</span>
              </>
            ) : id ? (
              "Update"
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
