

import { PublicationDataType } from "@/lib/type";
import { PublicationCard } from "./PublicationCard";

export const PublicationsList = ({
  publications,
}: {
  publications: PublicationDataType[];
}) => {
  return (
    <div className="flex w-full flex-col items-stretch gap-4 min-w-0">
      {/* <div className="w-full min-w-0">
        <FilterTabs
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
          industryData={industryData}
        />
      </div> */}

      <div className="flex w-full flex-col">
        {publications.length > 0 ? (
          publications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-borderColor bg-sectionColor p-12">
            <p className="text-liteDescriptionColor font-['Segoe_UI'] text-base">
              No publications found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
