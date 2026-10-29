import ConnectionRequestSection from "@/app/(Front-End)/_components/mainPage/network/ConnectionRequestSection";

export default async function page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) || {};
  const rawSearch = params.search;
  const searchQuery = Array.isArray(rawSearch)
    ? rawSearch[0] || ""
    : rawSearch || "";

  return (
    <div>
      <ConnectionRequestSection searchQuery={searchQuery} />
    </div>
  );
}
