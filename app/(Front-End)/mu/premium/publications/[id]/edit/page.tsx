import Breadcrumb from "@/app/(Front-End)/_components/Breadcrumb";
import PublicationCreatePage from "../../../../(pro-industry)/_component/publication/PublicationCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="pb-6">
      <div className="mb-4">
        <Breadcrumb />
      </div>
      <PublicationCreatePage id={id} />
    </div>
  );
}
