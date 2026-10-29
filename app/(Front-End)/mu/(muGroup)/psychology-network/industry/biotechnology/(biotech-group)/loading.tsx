// Skeleton shown immediately while the biotechnology page hydrates.
const CardSkeleton = () => (
  <div className="flex w-full flex-col gap-3 rounded-[10px] border border-[#ECEFF3] bg-white pb-2 animate-pulse">
    <div className="h-45 w-full rounded-[10px] bg-[#F0F2F5]" />
    <div className="px-3 space-y-2">
      <div className="h-4 w-3/4 rounded bg-[#F0F2F5]" />
      <div className="h-3 w-1/2 rounded bg-[#F0F2F5]" />
    </div>
  </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="flex w-full flex-col gap-6">
    <div className="h-5 w-64 rounded bg-[#F0F2F5]" aria-label={title} />
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export default function BiotechnologyLoading() {
  return (
    <div className="flex xl:max-w-196.5 lg:max-w-[455px] flex-col py-6">
      <div className="flex w-full flex-1 flex-col gap-10">
        <SectionSkeleton title="Loading Section..." />
        <SectionSkeleton title="Loading Section..." />
      </div>
    </div>
  );
}
