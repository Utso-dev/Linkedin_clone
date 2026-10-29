import { IndustrySidebar } from "./_components/IndustrySidebar";
import PartnersSlider from "./_components/PartnersSlider";

export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile Layout - Keep as is */}
      <div className="flex w-full flex-col gap-6 pt-6 lg:hidden">
        <IndustrySidebar />

        <div className="w-full min-w-0">
           <PartnersSlider />
          {children}</div>
      </div>

      {/* Desktop Layout - Modified for sticky sidebars */}
      <div className="hidden w-full gap-6 pt-10 lg:grid grid-cols-4">
        {/* Left Sidebar - Sticky with proper offset */}
        <div className="sticky top-24 h-fit col-span-1  shrink-0">
          <IndustrySidebar />
        </div>

        {/* Main Content - Scrollable */}
        <div className="col-span-3">
          <PartnersSlider />
          {children}
        </div>

        {/* Right Sidebar - Sticky with proper offset */}
        {/* <div className="sticky top-24 h-fit col-span-1 shrink-0">
              <PartnersSidebar />
            </div> */}
      </div>
    </>
  );
}
