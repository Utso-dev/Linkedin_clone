"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

interface ProductCardActionsProps {
    title: string;
    onEdit?: () => void;
    onRemove?: () => void;
    onDuplicate?: () => void;
}

export default function ProductCardActions({
    title,
    onEdit,
    onRemove,
    onDuplicate,
}: ProductCardActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={`Open options for ${title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] bg-white shadow-sm transition-colors hover:bg-gray-50"
                >
                    <EllipsisVertical className="h-4 w-4 text-gray-600" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32 bg-white">
                <DropdownMenuItem
                    onSelect={onEdit}
                    className="cursor-pointer"
                >
                    <Pencil />
                    Edit
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                    onSelect={onDuplicate}
                    className="cursor-pointer"
                >
                    <Copy />
                    Duplicate
                </DropdownMenuItem> */}
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={onRemove}
                    className="cursor-pointer"
                >
                    <Trash2 />
                    Remove 
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
