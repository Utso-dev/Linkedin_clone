import Error from "@/components/reusable/Error";
import { fetchWrapper } from "@/src/utils/fetchWrapper";
import SuggestConnectionListClient from "./SuggestConnectionListClient";

async function SuggestConnectionList({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  const query = searchQuery || "";
  const limit = 10;

  let suggestedConnections = { data: [] } as any;
  try {
    suggestedConnections = await fetchWrapper(
      `/connections/suggestions?page=1&per_page=${limit}&search=${encodeURIComponent(query)}`,
      {
        next: { tags: ["suggestions"] },
      },
    );
  } catch (error) {
    console.error("SuggestConnectionList server fetch error:", error);
    return <Error />;
  }

  const initialData = suggestedConnections.data || [];

  return (
    <SuggestConnectionListClient
      initialData={initialData}
      limit={limit}
      searchQuery={searchQuery}
    />
  );
}

export default SuggestConnectionList;
