"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Product } from "./ProductCard";
import { ProductCatalog } from "./biotechnology/catalogData";
import { cn } from "@/lib/utils";

export interface ProductFormValues {
    placement: string;
    title: string;
    subtitle: string;
    tag: string;
    learnMoreHref: string;
    imageUrl: string;
    description: string;
}

interface CreateProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: "add" | "edit";
    catalogs: ProductCatalog[];
    product?: Product | null;
    catalogId?: string;
    onSubmit?: (data: ProductFormValues) => void;
}

type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

const emptyForm: ProductFormValues = {
    placement: "",
    title: "",
    subtitle: "",
    tag: "",
    learnMoreHref: "",
    imageUrl: "",
    description: "",
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function buildPlacement(catalogId: string, tabId: string) {
    return `${catalogId}::${tabId}`;
}

export function parsePlacement(placement: string) {
    const [catalogId, tabId] = placement.split("::");
    return { catalogId, tabId };
}

export default function CreateProductModal({
    open,
    onOpenChange,
    mode = "add",
    catalogs,
    product,
    catalogId,
    onSubmit,
}: CreateProductModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && product && catalogId) {
            setForm({
                placement: buildPlacement(catalogId, product.categoryId),
                title: product.title,
                subtitle: product.subtitle ?? "",
                tag: product.tag ?? "",
                learnMoreHref: product.learnMoreHref ?? "",
                imageUrl: product.imageUrl,
                description: product.description,
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
        setIsDragging(false);
    }, [open, mode, product, catalogId]);

    const updateField = <K extends keyof ProductFormValues>(
        field: K,
        value: ProductFormValues[K],
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setForm(emptyForm);
            setErrors({});
            setIsDragging(false);
        }
        onOpenChange(nextOpen);
    };

    const applyImageFile = (file: File) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                imageUrl: "Support file: JPG, PNG or WEBP",
            }));
            return;
        }

        updateField("imageUrl", URL.createObjectURL(file));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: FormErrors = {};
        if (!form.placement) nextErrors.placement = "Placement is required";
        if (!form.title.trim()) nextErrors.title = "Product title is required";
        if (!form.subtitle.trim()) nextErrors.subtitle = "Subtitle / company is required";
        if (!form.tag.trim()) nextErrors.tag = "Product tag is required";
        if (!form.learnMoreHref.trim()) {
            nextErrors.learnMoreHref = "Learn more link is required";
        } else if (!/^https?:\/\//i.test(form.learnMoreHref.trim())) {
            nextErrors.learnMoreHref = "Enter a valid URL";
        }
        if (!form.imageUrl) nextErrors.imageUrl = "Product image is required";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit?.({
            ...form,
            title: form.title.trim(),
            subtitle: form.subtitle.trim(),
            tag: form.tag.trim(),
            learnMoreHref: form.learnMoreHref.trim(),
            description: form.description.trim(),
        });
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title={mode === "edit" ? "Edit Product (Psychology)" : "Add Product (Psychology)"}
            size="lg"
            className="gap-4 px-5 py-5 md:px-6 md:py-6"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                <div className="w-full">
                    <label className="mb-1.5 block text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56] font-['Segoe_UI']">
                        Placement (Section &gt; Category Tab)
                        <span className="ml-0.5">*</span>
                    </label>
                    <Select
                        value={form.placement || undefined}
                        onValueChange={(value) => updateField("placement", value)}
                    >
                        <SelectTrigger
                            type="button"
                            className={cn(
                                "h-12 w-full rounded-lg border-gray-300 bg-white px-3.5 text-sm shadow-none",
                                errors.placement && "border-red-500",
                            )}
                        >
                            <SelectValue placeholder="-- Select Specific Tab --" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            className="z-10050 bg-white"
                        >
                            {catalogs.map((catalog) => {
                                const tabs = catalog.tabs.filter((tab) => tab.id !== "all");
                                if (tabs.length === 0) return null;

                                return (
                                    <SelectGroup key={catalog.id}>
                                        <SelectLabel className="px-3 py-2 text-sm font-semibold text-[#1D1F2C]">
                                            {catalog.title}
                                        </SelectLabel>
                                        {tabs.map((tab) => (
                                            <SelectItem
                                                key={`${catalog.id}::${tab.id}`}
                                                value={buildPlacement(catalog.id, tab.id)}
                                                className="cursor-pointer py-2 pl-6 data-[state=checked]:bg-[#E6F7F9]"
                                            >
                                                {tab.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.placement && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.placement}</p>
                    )}
                    <p className="mt-2 rounded-md bg-[#F5F6F8] px-3 py-2 text-xs leading-5 text-[#8C8C8C]">
                        Note: A section will only appear here if you have added at least one
                        custom tab in Category Management.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CustomInput
                        label="Product Title"
                        required
                        name="title"
                        placeholder="e.g. Magstim TMS"
                        value={form.title}
                        onChange={(event) => updateField("title", event.target.value)}
                        error={errors.title}
                    />
                    <CustomInput
                        label="Subtitle / Company"
                        required
                        name="subtitle"
                        placeholder="e.g. Brain Products"
                        value={form.subtitle}
                        onChange={(event) => updateField("subtitle", event.target.value)}
                        error={errors.subtitle}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CustomInput
                        label="Product Tag"
                        required
                        name="tag"
                        placeholder="e.g. TMS, EEG"
                        value={form.tag}
                        onChange={(event) => updateField("tag", event.target.value)}
                        error={errors.tag}
                    />
                    <CustomInput
                        label="Learn More Link (URL)"
                        required
                        name="learnMoreHref"
                        type="url"
                        placeholder="https://example.com"
                        value={form.learnMoreHref}
                        onChange={(event) => updateField("learnMoreHref", event.target.value)}
                        error={errors.learnMoreHref}
                    />
                </div>

                <div className="w-full">
                    <label className="mb-1.5 block text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56] font-['Segoe_UI']">
                        Upload Product Image
                        <span className="ml-0.5">*</span>
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) applyImageFile(file);
                            event.target.value = "";
                        }}
                    />
                    <button
                        type="button"
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            const file = event.dataTransfer.files?.[0];
                            if (file) applyImageFile(file);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
                            isDragging
                                ? "border-[#04A1B7] bg-[#E6F7F9]"
                                : errors.imageUrl
                                    ? "border-red-500 bg-white"
                                    : "border-[#D1D5DB] bg-white hover:border-[#04A1B7]",
                        )}
                    >
                        {form.imageUrl ? (
                            <img
                                src={form.imageUrl}
                                alt="Product preview"
                                className="mb-3 h-24 max-w-full object-contain"
                            />
                        ) : (
                            <CloudUpload className="mb-2 h-8 w-8 text-[#98A2B3]" />
                        )}
                        <p className="text-sm text-[#4A4C56]">
                            Drag and drop your file, or{" "}
                            <span className="font-medium text-[#04A1B7]">choose here</span>
                        </p>
                        <p className="mt-1 text-xs text-[#98A2B3]">
                            Support file: JPG, PNG or WEBP
                        </p>
                    </button>
                    {errors.imageUrl && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.imageUrl}</p>
                    )}
                </div>

                <div className="w-full">
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-base font-semibold leading-6 tracking-[0.08px] text-[#4A4C56] font-['Segoe_UI']"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={5}
                        placeholder="Brief company legacy..."
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <CustomButton
                        variant="ghost"
                        className="rounded-lg border border-[#D1D5DB] px-5 text-[#1D1F2C] hover:bg-gray-50"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="rounded-lg px-5">
                        Save Product Information
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
