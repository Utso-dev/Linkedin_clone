import MainPageLeftSidebar from "@/app/(Front-End)/_components/mainPage/MainPageLeftSidebar";
import NetworkSidebarLayout from "@/app/(Front-End)/_components/mainPage/network/NetworkSidebarLayout";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="">
        <div className="lg:grid lg:grid-cols-8 xl:grid-cols-10  py-4 sm:py-6 gap-6 lg:py-10 mb-10">
          <div className="hidden lg:block col-span-2 lg:sticky lg:top-25 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto self-start">
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
