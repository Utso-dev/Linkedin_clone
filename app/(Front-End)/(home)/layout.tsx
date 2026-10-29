import Navbar from "@/app/(Front-End)/_components/Navbar";
import Footer from "../_components/Footer";
export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] min-h-screen">
      <Navbar />
      <div className="w-full h-full grid overflow-y-auto min-h-0">
        {children}
        <Footer />
      </div>
    </div>
  );
}
