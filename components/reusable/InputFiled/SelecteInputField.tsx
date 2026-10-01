"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export type Option = { value: string; label: string; icon?: React.ReactNode };

export type CategoryGroup = {
  group: string;
  options: Option[];
};

export type SelectItemOption = Option | CategoryGroup;

interface SelecteInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  options?: SelectItemOption[];
  groups?: CategoryGroup[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function SelecteInputField({
  value,
  onChange,
  onValueChange,
  options = [],
  groups,
  placeholder = "Select",
  className = "",
  id,
  disabled = false,
}: SelecteInputFieldProps) {
  const handleChange = onChange ?? onValueChange;

  const isGrouped =
    Boolean(groups && groups.length > 0) ||
    Boolean(
      options &&
      options.length > 0 &&
      "group" in options[0] &&
      Array.isArray((options[0] as CategoryGroup).options),
    );

  const activeGroups: CategoryGroup[] =
    groups || (isGrouped ? (options as CategoryGroup[]) : []);

  // Custom grouped accordion select state
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (isGrouped) {
    // Find selected label across all groups
    let selectedLabel = "";
    for (const g of activeGroups) {
      const match = g.options.find(
        (opt) => String(opt.value) === String(value),
      );
      if (match) {
        selectedLabel = match.label;
        break;
      }
    }
    if (!selectedLabel && value) {
      selectedLabel = String(value);
    }

    const toggleGroup = (groupName: string) => {
      setOpenGroups((prev) => ({
        ...prev,
        [groupName]: prev[groupName] !== undefined ? !prev[groupName] : false,
      }));
    };

    return (
      <div className="relative w-full" ref={containerRef}>
        {/* Trigger */}
        <div
          id={id}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-borderColor bg-white px-3.5 text-sm cursor-pointer select-none transition-all",
            className,
            disabled
              ? "bg-bgColor text-descriptionColor cursor-not-allowed"
              : "hover:border-borderColor",
            isOpen && "border-gray-400 ring-1 ring-gray-400/20",
          )}
        >
          <span
            className={
              !selectedLabel ? "text-descriptionColor/80" : "text-headerColor font-normal"
            }
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-descriptionColor transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-borderColor rounded-lg shadow-lg z-50 max-h-80 md:max-h-96 overflow-y-auto">
            {activeGroups.map((group) => {
              const isGroupOpen = openGroups[group.group] !== false; // default open
              return (
                <div
                  key={group.group}
                  className=" border-gray-100 last:border-b"
                >
                  {/* Group Header */}
                  <div
                    onClick={() => toggleGroup(group.group)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-headerColor bg-white hover:bg-gray-50/80 cursor-pointer select-none transition-colors border-b border-gray-100"
                  >
                    <span>{group.group}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-600 transition-transform duration-200",
                        isGroupOpen ? "rotate-0" : "-rotate-90",
                      )}
                    />
                  </div>

                  {/* Group Sub-Items */}
                  {isGroupOpen && (
                    <div className="bg-white">
                      {group.options.map((opt) => {
                        const isSelected = String(value) === String(opt.value);
                        return (
                          <div
                            key={opt.value}
                            onClick={() => {
                              handleChange?.(opt.value);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "px-5 py-2.5 text-sm text-headerColor cursor-pointer transition-colors  border-gray-100 last:border-b hover:bg-gray-50",
                              isSelected && "bg-[#EEF2F6] font-medium",
                            )}
                          >
                            {opt.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard flat select using Radix UI
  const flatOptions = options as Option[];

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        id={id}
        className={`cursor-pointer w-full ${className}`}
        disabled={disabled}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {flatOptions.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {opt.icon && <span className="">{opt.icon}</span>} {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
