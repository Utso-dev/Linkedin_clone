"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

type PartnerData = {
    id?: number;
    networkType?: string;
    industryType?: string;
    partnerName?: string;
    partnerTag?: string;
    description?: string;
    website?: string;
};

interface PartnerFormProps {
    mode?: "add" | "edit";
    data?: PartnerData;
    onClose?: () => void;
}

export default function PartnerForm({
    mode = "add",
    data,
    onClose,
}: PartnerFormProps) {
    const [formData, setFormData] = useState({
        networkType: data?.networkType ?? "",
        industryType: data?.industryType ?? "",
        partnerName: data?.partnerName ?? "",
        partnerTag: data?.partnerTag ?? "",
        description: data?.description ?? "",
        website: data?.website ?? "",
    });

    const handleChange = (
        field: keyof typeof formData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const payload = {
            ...formData,
            ...(mode === "edit" && data?.id
                ? { id: data.id }
                : {}),
        };

        if (mode === "add") {
            console.log("ADD PARTNER:", payload);

            // POST API
            // await createPartner(payload).unwrap();
        } else {
            console.log("UPDATE PARTNER:", payload);

            // UPDATE API
            // await updatePartner({
            //     id: data?.id,
            //     data: payload,
            // }).unwrap();
        }

        onClose?.();
    };

    return (
        <div className="p-4">
            <div className="space-y-5">

                {/* Network Type + Industry Type */}
                <div className="grid grid-cols-2 gap-4">

                    <CustomSelect
                        label="Network Type"
                        required
                        placeholder="Select Network"
                        value={formData.networkType}
                        onChange={(val) =>
                            handleChange(
                                "networkType",
                                val as string
                            )
                        }
                        options={[
                            {
                                label: "Psychology Network",
                                value: "Psychology Network",
                            },
                            {
                                label: "Neuroscience Network",
                                value: "Neuroscience Network",
                            },
                        ]}
                    />

                    <CustomSelect
                        label="Industry Type"
                        required
                        placeholder="Select Industry"
                        value={formData.industryType}
                        onChange={(val) =>
                            handleChange(
                                "industryType",
                                val as string
                            )
                        }
                        options={[
                            {
                                label: "Biotechnology",
                                value: "Biotechnology",
                            },
                            {
                                label: "Psychotropics",
                                value: "Psychotropics",
                            },
                            {
                                label: "Publications",
                                value: "Publications",
                            },
                        ]}
                    />
                </div>

                {/* Partner Name */}
                <CustomInput
                    label="Partner Name"
                    required
                    placeholder="Enter Partner Name"
                    value={formData.partnerName}
                    onChange={(e) =>
                        handleChange(
                            "partnerName",
                            e.target.value
                        )
                    }
                />

                {/* Partner Tag */}
                <CustomInput
                    label="Partner Tag"
                    placeholder="Enter Partner Tag"
                    value={formData.partnerTag}
                    onChange={(e) =>
                        handleChange(
                            "partnerTag",
                            e.target.value
                        )
                    }
                />

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-[#4A4C56] font-['Segoe_UI'] text-base font-semibold leading-6 tracking-[0.08px] ">
                        Description
                    </label>

                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleChange(
                                "description",
                                e.target.value
                            )
                        }
                        placeholder="Enter Description"
                        rows={5}
                        className="w-full resize-none rounded-lg mt-1 border border-[#B6B6B6] p-2 text-sm text-[#4A4C56] outline-none focus:border-primaryColor"
                    />
                </div>

                {/* Website */}
                <CustomInput
                    label="Website Link (URL)"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                        handleChange(
                            "website",
                            e.target.value
                        )
                    }
                />

                {/* Buttons */}
                <div className="flex justify-end gap-2.5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-[#B6B6B6] px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="cursor-pointer rounded-lg border bg-primaryColor px-5 py-2 text-white"
                    >
                        {mode === "add"
                            ? "Save Information"
                            : "Save Information"}
                    </button>
                </div>
            </div>
        </div>
    );
}