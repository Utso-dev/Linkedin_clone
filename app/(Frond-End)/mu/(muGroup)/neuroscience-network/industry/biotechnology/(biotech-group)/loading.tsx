// Skeleton for neuroscience biotechnology
const CardSkeleton = () => (
  <div className="flex w-full flex-col gap-3 rounded-[10px] border border-[#ECEFF3] bg-white p-4 animate-pulse">
    <div className="flex justify-between">
      <div className="h-5 w-24 rounded bg-[#F0F2F5]" />
      <div className="h-5 w-16 rounded-full bg-[#F0F2F5]" />
    </div>
    <div className="h-3 w-1/2 rounded bg-[#F0F2F5]" />
  </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="flex w-full flex-col gap-6">
    <div className="h-5 w-56 rounded bg-[#F0F2F5]" aria-label={title} />
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export default function BiotechnologyLoading() {
  return (
    <div className="flex xl:max-w-196.5 lg:max-w-113.75 flex-col py-8 lg:py-10 gap-10">
      <SectionSkeleton title="Loading Section..." />
      <SectionSkeleton title="Loading Section..." />
    </div>
  );
}
