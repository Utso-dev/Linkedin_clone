import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationSkeleton() {
    return (
        <div className="md:px-4 space-y-6">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                        <Skeleton className="w-full h-4 mt-2" />
                        <Skeleton className="w-1/3 h-4 mt-2" />
                    </div>
                    <div className="grid w-full h-full items-end">
                        <Skeleton className="w-16 h-4" />
                    </div>
                </div>
            ))}
        </div>
    )
}