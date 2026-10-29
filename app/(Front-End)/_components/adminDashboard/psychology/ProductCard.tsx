import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCardActions from "./ProductCardActions";
import { cn } from "@/lib/utils";

export interface Product {
    id: string;
    title: string;
    categoryId: string;
    category: string;
    description: string;
    imageUrl: string;
    learnMoreHref?: string;
    subtitle?: string;
    tag?: string;
}

export interface ProductCardProps extends Omit<Product, "categoryId"> {
    className?: string;
    onEdit?: (id: string) => void;
    onRemove?: (id: string) => void;
    onDuplicate?: (id: string) => void;
}

export default function ProductCard({
    id,
    title,
    category,
    description,
    imageUrl,
    learnMoreHref,
    className,
    onEdit,
    onRemove,
    onDuplicate,
}: ProductCardProps) {
    return (
        <article
            className={cn(
                "group relative flex w-full flex-col gap-3 rounded-[10px] border border-[#E4E7EC] bg-white pb-2 transition-colors duration-150 hover:bg-[#ECEFF3]",
                className,
            )}
        >
            <div className="relative px-4 pt-4">
                <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 367px"
                    />
                </div>

                <div className="absolute top-3 right-3">
                    <ProductCardActions
                        title={title}
                        onEdit={() => onEdit?.(id)}
                        onDuplicate={() => onDuplicate?.(id)}
                        onRemove={() => onRemove?.(id)}
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-4">
                <h3 className="truncate font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#101828]">
                    {title}
                </h3>

                <span className="mt-0.5 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#667085]">
                    {category}
                </span>

                <p className="mt-2 line-clamp-2 font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#475467]">
                    {description}
                </p>

                {learnMoreHref && (
                    <Link
                        href={learnMoreHref}
                        className="mt-auto mb-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-[#0B7285] hover:underline"
                    >
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>
        </article>
    );
}
