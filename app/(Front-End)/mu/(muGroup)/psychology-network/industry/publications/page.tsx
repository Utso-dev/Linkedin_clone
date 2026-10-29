import { IndustryHeader } from "../_components";
import PublicationSectionPart from "./_components/PublicationSectionPart";

export default function PublicationsPage() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-1 flex-col">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            title="Publications"
            description="Explore new publications from the brain health community."
          />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col items-start gap-10 pt-6">
          <div className="flex w-full flex-col items-start gap-6">
            <PublicationSectionPart />
          </div>
        </div>
      </div>
    </div>
  );
}
