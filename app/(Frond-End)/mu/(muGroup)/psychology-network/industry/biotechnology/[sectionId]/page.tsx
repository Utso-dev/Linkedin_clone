"use client";
import { useGetProductFeedQuery } from "@/feature/slice/biotechnologySlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";

function page({ params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const queryParams = {
    network_type: "neuroscience",
    industry_type: "biotechnology",
    view: "all",
    per_page: 12,
    section_id: Number(sectionId),
  };

  const {
    items: products,
    isInitialLoading,
    isFetchingMore,
    observerRef,
  } = useCursorQuery<any>(useGetProductFeedQuery, queryParams, {
    getItemId: (item) => item.id,
  });

  console.log(products, "products");

  return <div>page</div>;
}

export default page;
