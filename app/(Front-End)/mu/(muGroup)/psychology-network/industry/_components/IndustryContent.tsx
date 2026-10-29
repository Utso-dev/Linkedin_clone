// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustryContent.tsx

interface IndustryContentProps {
  title: string;
  searchQuery: string;
}

export const IndustryContent = ({
  title,
  searchQuery,
}: IndustryContentProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:px-0 md:py-10">
      <p className="text-[#A5A5AB]">{title} content coming soon...</p>
    </div>
  );
};
