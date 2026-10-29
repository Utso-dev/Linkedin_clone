"use client";

import { usePathname } from "next/navigation";

import MainNavbar from "./mainPage/MainNavbar";
import MainFooter from "@/components/reusable/MainFooter";

export default function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noContainerRoutes = ["/mu/about-us"];

  const shouldUseContainer = !noContainerRoutes.includes(pathname);

  return (
    <div className="min-h-screen">
      <MainNavbar />

      {shouldUseContainer ? (
        <div className="container h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}

      <MainFooter />
    </div>
  );
}

// import MainNavbar from "./mainPage/MainNavbar";
// import MainFooter from "@/components/reusable/MainFooter";

// export default function RootProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className=" min-h-screen">
//       <MainNavbar />
//       <div className="container h-full w-full ">{children}</div>
//       <MainFooter />
//     </div>
//   );
// }
