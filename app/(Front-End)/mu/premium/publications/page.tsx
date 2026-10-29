import Breadcrumb from "@/app/(Front-End)/_components/Breadcrumb";
import PublicationPage from "../../(pro-industry)/_component/publication/PublicationPage";

function page() {
  return (
    <div className="pb-6">
      <div className="pb-4">
        <Breadcrumb />
      </div>
      <PublicationPage />
    </div>
  );
}

export default page;
