import PublicationCreatePage from "../../../_component/publication/PublicationCreatePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicationCreatePage id={id} />;
}