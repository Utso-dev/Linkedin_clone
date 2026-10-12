import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteScroll(
  data,
  isFetching,
  isLoading,
  observerOptions = {},
  resetKey,
) {
  const [page, setPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    setPage(1);
    setCombinedData(data?.data || []);
  }, [resetKey]);

  // Reset or append data when the API response changes
  useEffect(() => {
    if (data?.data) {
      setCombinedData((prev) => {
        if (page === 1) {
          return data.data;
        }

        const merged = [...prev];

        data.data.forEach((newItem) => {
          const existingIndex = merged.findIndex(
            (oldItem) => oldItem.id === newItem.id,
          );

          if (existingIndex === -1) {
            merged.push(newItem);
          } else {
            merged[existingIndex] = newItem;
          }
        });

        return merged;
      });
    }
  }, [data, page]);

  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          // If the bottom is reached and the current request returned data, load next
          if (entries[0].isIntersecting && data?.data?.length > 0) {
            setPage((prev) => prev + 1);
          }
        },
        {
          rootMargin: "200px",
          threshold: 0,
          ...observerOptions,
        },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, data, observerOptions],
  );

  return { page, combinedData, lastElementRef };
}
