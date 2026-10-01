import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const customButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 cursor-pointer",
    {
        variants: {
            variant: {
                primary:
                    "bg-[#04A1B7] text-white hover:bg-[#038A9D] focus-visible:ring-[#04A1B7]",
                dark:
                    "bg-[#1D1F2C] text-white hover:bg-[#30323F] focus-visible:ring-[#1D1F2C]",
                outline:
                    "border border-[#04A1B7] bg-transparent text-[#04A1B7] hover:bg-[#04A1B7]/10 focus-visible:ring-[#04A1B7]",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
                ghost:
                    "bg-transparent text-[#1D1F2C] hover:bg-gray-100 focus-visible:ring-gray-400",
            },
            size: {
                sm: "h-8 px-3 text-sm",
                md: "h-10 px-4 text-sm",
                lg: "h-11 px-5 text-base",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
        },
    },
);

interface CustomButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof customButtonVariants> {
    loading?: boolean;
    loadingText?: ReactNode;
}

export default function CustomButton({
    children,
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    loadingText = "Loading...",
    disabled,
    type = "button",
    ...props
}: CustomButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={cn(
                customButtonVariants({ variant, size, fullWidth }),
                className,
            )}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}