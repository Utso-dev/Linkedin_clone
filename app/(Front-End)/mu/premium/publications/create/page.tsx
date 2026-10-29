import Breadcrumb from "@/app/(Front-End)/_components/Breadcrumb";
import PublicationCreatePage from "../../../(pro-industry)/_component/publication/PublicationCreatePage";

export default function Page() {
  return (
    <div className="pb-4">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <PublicationCreatePage />
    </div>
  );
}
