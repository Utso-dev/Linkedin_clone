import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";

function ConnectionRequestLoading({length = 8}: {length?: number}) {
  return (
    <div>
      {Array.from({ length: length }).map((_, index) => (
        <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
      ))}
    </div>
  );
}

export default ConnectionRequestLoading;
