import MainPageLeftSidebar from "@/app/(Frond-End)/_components/mainPage/MainPageLeftSidebar";
import NetworkSidebarLayout from "@/app/(Frond-End)/_components/mainPage/network/NetworkSidebarLayout";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="">
        <div className="lg:grid lg:grid-cols-8 xl:grid-cols-10 sm:py-8 py-6 gap-6 md:py-10 mb-10">
          <div className="hidden lg:block col-span-2   lg:sticky lg:top-25  lg:overflow-y-auto self-start">
            <MainPageLeftSidebar />
          </div>
          <div className="xl:col-span-8 lg:border-l lg:pl-6 border-[#D2D2D5] lg:col-span-6 col-span-12">
            <NetworkSidebarLayout>{children}</NetworkSidebarLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
