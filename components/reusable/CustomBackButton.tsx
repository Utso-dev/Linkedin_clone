"use client";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

function CustomBackButton({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  return (
    <button
      aria-label="back-network-sidebar"
      className={`flex items-center cursor-pointer gap-1.5 ${className}`}
      onClick={() => router.back()}
    >
      <FaChevronLeft className={`w-3.5 h-3.5 ${iconClassName}`} />
      Back
    </button>
  );
}

export default CustomBackButton;
