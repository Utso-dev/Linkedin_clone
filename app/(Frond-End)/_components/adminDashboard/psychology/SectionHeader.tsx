import { PlusIcon } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

interface SectionHeaderProps {
    title: string;
    expanded?: boolean;
    canExpand?: boolean;
    onToggleExpand?: () => void;
    onAddToSection?: () => void;
}

export default function SectionHeader({
    title,
    expanded = false,
    canExpand = false,
    onToggleExpand,
    onAddToSection,
}: SectionHeaderProps) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold leading-[130%] tracking-[0.5%] text-[#1D1F2C]">
                {title}
            </h2>

            <div className="flex items-center gap-2">
                {/* <CustomButton variant="outline" onClick={onAddToSection}>
                    <PlusIcon className="h-4 w-4" />
                    Add to Section
                </CustomButton> */}
                {canExpand && (
                    <CustomButton onClick={onToggleExpand}>
                        {expanded ? "Show Less" : "Show More"}
                    </CustomButton>
                )}
            </div>
        </div>
    );
}
