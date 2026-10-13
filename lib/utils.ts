import dayjs from "@/lib/dayjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToTop() {
  if (typeof window === "undefined") return;

  window.scrollTo({ top: 0, behavior: "auto" });
}

export function normalizeSkillsList(skills?: unknown): string[] {
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

export const formatPostDate = (date: string) => {
  const postDate = dayjs(date);
  const now = dayjs();
  const diffDays = now.diff(postDate, "day");
  if (diffDays >= 365) {
    const years = now.diff(postDate, "year");
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }

  if (diffDays >= 30) {
    const months = now.diff(postDate, "month");
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  return postDate.fromNow();
};

export const formatAmount = ({
  type,
  value,
  range,
}: {
  type?: string;
  value: string;
  range?: number;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: range || 2,
    maximumFractionDigits: range || 2,
  }).format(Number(value));

export const formatNumber = ({
  type,
  value,
}: {
  type?: string;
  value: string;
}) =>
  new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));

export const formatNumberIntoK = ({
  type,
  value,
}: {
  type?: string;
  value: string;
}) => {
  const num = Number(value);
  if (num >= 1000) {
    return (
      new Intl.NumberFormat(type || "en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.floor(num / 1000)) + "K"
    );
  }
  return new Intl.NumberFormat(type || "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

 export function truncateText(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..."
      : text;
  }

  
  export const getApplicationStatusConfig = (statusRaw?: string) => {
    const s = String(statusRaw || "")
      .toLowerCase()
      .trim();
  
    if (s === "pending" || s.includes("review")) {
      return {
        label: "Appliaction is being reviewed",
        className: "bg-[#FEF6D8] text-[#B45309]",
      };
    }
    if (s.includes("interview")) {
      return {
        label: "Interview HR",
        className: "bg-[#E6F8F6] text-[#0D9488]",
      };
    }
    if (s.includes("assessment")) {
      return {
        label: "Assessment",
        className: "bg-[#E8F0FE] text-[#2563EB]",
      };
    }
    if (s.includes("offer")) {
      return {
        label: "Offering",
        className: "bg-[#F3E8FF] text-[#7E22CE]",
      };
    }
    if (s === "hired" || s.includes("accept")) {
      return {
        label: "Hired",
        className: "bg-[#E6F8F6] text-[#059669]",
      };
    }
    if (s.includes("reject")) {
      return {
        label: "Rejected",
        className: "bg-[#FEE2E2] text-[#DC2626]",
      };
    }
    if (s.includes("close")) {
      return {
        label: "Hiring Closed",
        className: "bg-[#F3F4F6] text-[#6B7280]",
      };
    }
  
    const formatted = s
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : "Appliaction is being reviewed";
    return {
      label: formatted,
      className: "bg-[#FEF6D8] text-[#B45309]",
    };
  };