import Error from "@/components/reusable/Error";
import { ConnectionRequestType } from "@/lib/type";
import { fetchWrapper } from "@/src/utils/fetchWrapper";
import ConnectionNotFound from "./connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "./connectionRequests/ConnectionRequestCard";

async function CurrentConnectionRequest({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  const query = searchQuery || "";

  let connectionRequests = { data: [] } as any;
  try {
    connectionRequests = await fetchWrapper(
      `/connections/requests?page=1&limit=5&search=${encodeURIComponent(query)}`,
      {
        next: { tags: ["connection"] },
      },
    );
  } catch (error) {
    console.error("PostList server fetch error:", error);
    return <Error />;
  }

  return (
    <div className="space-y-3">
      {connectionRequests.data.length > 0 ? (
        connectionRequests.data.map((request: ConnectionRequestType) => (
          <ConnectionRequestCard key={request.id} item={request} />
        ))
      ) : (
        <ConnectionNotFound />
      )}
    </div>
  );
}

export default CurrentConnectionRequest;
