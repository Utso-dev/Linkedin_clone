"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface CursorPaginationMeta {
  limit?: number;
  per_page?: number;
  next_cursor?: string | null;
  prev_cursor?: string | null;
  has_more_pages?: boolean;
  total?: number;
}

export interface UseCursorPaginationOptions<T = any> {
  /**
   * The API response data object containing items and pagination metadata.
   */
  data?: any;

  /**
   * Initial or overall loading state from the query.
   */
  isLoading?: boolean;

  /**
   * Fetching state indicating if a network request is in flight.
   */
  isFetching?: boolean;

  /**
   * External active cursor state (optional). If not provided, the hook manages cursor internally.
   */
  cursor?: string | null;

  /**
   * External cursor setter function (optional).
   */
  setCursor?: React.Dispatch<React.SetStateAction<string | null>>;

  /**
   * Dependency value or object that triggers a full reset (e.g., search query, filters).
   */
  resetKey?: any;

  /**
   * Custom function to extract a unique ID from an item for de-duplication.
   */
  getItemId?: (item: T) => string | number;

  /**
   * Custom function to extract items array from the response.
   */
  extractItems?: (response: any) => T[];

  /**
   * Optional limit / per_page value to send to the query.
   */
  limit?: number;

  /**
   * Intersection observer options for infinite scroll.
   * Defaults to { rootMargin: "250px", threshold: 0 }.
   */
  observerOptions?: IntersectionObserverInit;

  /**
   * Callback fired when next page is requested.
   */
  onLoadMore?: (nextCursor: string) => void;
}

export interface UseCursorPaginationReturn<T = any> {
  /**
   * All accumulated and de-duplicated items.
   */
  combinedData: T[];

  /**
   * Alias for combinedData.
   */
  items: T[];

  /**
   * The active cursor used for the current page request (null for first page).
   */
  cursor: string | null;

  /**
   * Function to update or reset the active cursor.
   */
  setCursor: React.Dispatch<React.SetStateAction<string | null>>;

  /**
   * The next cursor returned by the latest API response (null if no more pages).
   */
  nextCursor: string | null;

  /**
   * Boolean indicating if more pages are available to fetch.
   */
  hasMore: boolean;

  /**
   * Initial loading state (true only when loading the first batch of items).
   */
  isInitialLoading: boolean;

  /**
   * Fetching more state (true when loading subsequent pages).
   */
  isFetchingMore: boolean;

  /**
   * Total number of items reported by the API, if available.
   */
  total: number;

  /**
   * Manually trigger loading the next page.
   */
  loadMore: () => void;

  /**
   * Manually reset accumulated items and cursor to initial state.
   */
  reset: () => void;

  /**
   * Callback ref to attach to the last item in the list for automatic infinite scroll.
   */
  lastElementRef: (node: HTMLElement | null) => void;

  /**
   * Callback ref to attach to a bottom sentinel element for automatic infinite scroll.
   */
  observerRef: (node: HTMLElement | null) => void;
}

/**
 * Helper to safely extract items and pagination metadata from diverse API formats.
 */
function extractPaginationData<T>(
  response: any,
  customExtract?: (res: any) => T[],
) {
  if (!response) {
    return {
      items: [] as T[],
      nextCursor: null as string | null,
      prevCursor: null as string | null,
      hasMore: false,
      total: 0,
    };
  }

  // 1. Extract items
  let items: T[] = [];
  if (customExtract) {
    items = customExtract(response) || [];
  } else if (Array.isArray(response)) {
    items = response;
  } else if (Array.isArray(response?.data)) {
    items = response.data;
  } else if (Array.isArray(response?.data?.data)) {
    items = response.data.data;
  }

  // 2. Extract pagination object
  const paginationObj =
    response?.pagination || response?.meta?.pagination || response?.meta || {};

  // 3. Next cursor
  const nextCursor =
    paginationObj?.next_cursor ??
    response?.next_cursor ??
    paginationObj?.cursor?.next ??
    null;

  // 4. Prev cursor
  const prevCursor =
    paginationObj?.prev_cursor ??
    response?.prev_cursor ??
    paginationObj?.cursor?.prev ??
    null;

  // 5. Has more pages
  let hasMore = false;
  if (typeof paginationObj?.has_more_pages === "boolean") {
    hasMore = paginationObj.has_more_pages;
  } else if (typeof paginationObj?.has_more === "boolean") {
    hasMore = paginationObj.has_more;
  } else if (typeof response?.has_more_pages === "boolean") {
    hasMore = response.has_more_pages;
  } else if (typeof response?.has_more === "boolean") {
    hasMore = response.has_more;
  } else {
    hasMore = Boolean(nextCursor && items.length > 0);
  }

  // 6. Total count
  const total =
    response?.total_jobs ??
    response?.stats?.total_jobs ??
    paginationObj?.total ??
    response?.total ??
    0;

  return { items, nextCursor, prevCursor, hasMore, total };
}

/**
 * Universal cursor-based pagination and infinite scroll hook.
 */
export function useCursorPagination<T = any>({
  data,
  isLoading = false,
  isFetching = false,
  cursor: externalCursor,
  setCursor: externalSetCursor,
  resetKey,
  getItemId: customGetItemId,
  extractItems,
  observerOptions,
  onLoadMore,
}: UseCursorPaginationOptions<T>): UseCursorPaginationReturn<T> {
  // Internal cursor state when external cursor is not provided
  const [internalCursor, setInternalCursor] = useState<string | null>(null);

  const activeCursor = externalCursor !== undefined ? externalCursor : internalCursor;
  const setCursor = externalSetCursor || setInternalCursor;

  const [combinedData, setCombinedData] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // Track processed data reference to prevent duplicate processing
  const lastProcessedDataRef = useRef<any>(null);
  const prevResetKeyRef = useRef<string>("");

  // Consistent ID extractor
  const getItemId = useCallback(
    (item: any): string | number => {
      if (customGetItemId) return customGetItemId(item);
      return (
        item?.id ??
        item?.job_id ??
        item?.application_id ??
        item?._id ??
        item?.slug ??
        JSON.stringify(item)
      );
    },
    [customGetItemId],
  );

  // Serialize reset key safely
  const resetKeyStr = useMemo(() => {
    if (resetKey === undefined) return "";
    try {
      return JSON.stringify(resetKey);
    } catch {
      return String(resetKey);
    }
  }, [resetKey]);

  // Handle reset when resetKey changes (e.g. new search term or filter change)
  useEffect(() => {
    if (!resetKeyStr) return;

    if (prevResetKeyRef.current && prevResetKeyRef.current !== resetKeyStr) {
      setCombinedData([]);
      setCursor(null);
      setNextCursor(null);
      setHasMore(false);
      lastProcessedDataRef.current = null;
    }
    prevResetKeyRef.current = resetKeyStr;
  }, [resetKeyStr, setCursor]);

  // Accumulate or reset data when new API response arrives
  useEffect(() => {
    if (!data) return;

    // Skip if we already processed this exact response object
    if (lastProcessedDataRef.current === data) return;
    lastProcessedDataRef.current = data;

    const {
      items: newItems,
      nextCursor: extractedNextCursor,
      hasMore: extractedHasMore,
      total: extractedTotal,
    } = extractPaginationData<T>(data, extractItems);

    setNextCursor(extractedNextCursor);
    setHasMore(extractedHasMore);
    if (extractedTotal) setTotal(extractedTotal);

    setCombinedData((prev) => {
      // First page: replace data completely
      if (!activeCursor) {
        return newItems;
      }

      // Subsequent page: merge and de-duplicate
      const merged = [...prev];
      newItems.forEach((newItem) => {
        const newId = getItemId(newItem);
        const existingIndex = merged.findIndex(
          (oldItem) => getItemId(oldItem) === newId,
        );

        if (existingIndex === -1) {
          merged.push(newItem);
        } else {
          // Update item in place
          merged[existingIndex] = newItem;
        }
      });

      return merged;
    });
  }, [data, activeCursor, getItemId, extractItems]);

  // Trigger loading next page
  const loadMore = useCallback(() => {
    if (isLoading || isFetching) return;
    if (!hasMore || !nextCursor) return;

    setCursor(nextCursor);
    onLoadMore?.(nextCursor);
  }, [isLoading, isFetching, hasMore, nextCursor, setCursor, onLoadMore]);

  // Trigger manual reset
  const reset = useCallback(() => {
    setCombinedData([]);
    setCursor(null);
    setNextCursor(null);
    setHasMore(false);
    lastProcessedDataRef.current = null;
  }, [setCursor]);

  // Infinite scroll intersection observer
  const observer = useRef<IntersectionObserver | null>(null);

  const attachObserver = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasMore &&
            nextCursor &&
            !isLoading &&
            !isFetching
          ) {
            loadMore();
          }
        },
        {
          rootMargin: "250px",
          threshold: 0,
          ...observerOptions,
        },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore, nextCursor, loadMore, observerOptions],
  );

  const lastElementRef = attachObserver;
  const observerRef = attachObserver;

  const isInitialLoading =
    (isLoading || isFetching) && combinedData.length === 0;
  const isFetchingMore = isFetching && combinedData.length > 0;

  return {
    combinedData,
    items: combinedData,
    cursor: activeCursor,
    setCursor,
    nextCursor,
    hasMore,
    isInitialLoading,
    isFetchingMore,
    total,
    loadMore,
    reset,
    lastElementRef,
    observerRef,
  };
}

/**
 * High-level wrapper hook for RTK Query endpoints.
 * Automatically injects the active cursor into query params and handles infinite scroll.
 *
 * Example:
 * ```tsx
 * const {
 *   combinedData: jobs,
 *   isLoading,
 *   isFetchingMore,
 *   hasMore,
 *   observerRef,
 * } = useCursorQuery(useGetUserAllJobsQuery, params);
 * ```
 */
export function useCursorQuery<T = any>(
  queryHook: (params: any) => any,
  params: Record<string, any> = {},
  options?: Omit<
    UseCursorPaginationOptions<T>,
    "data" | "isLoading" | "isFetching" | "cursor" | "setCursor"
  >,
) {
  const [cursor, setCursor] = useState<string | null>(null);

  // Automatically append limit and cursor to query params
  const queryParams = useMemo(() => {
    return {
      ...(options?.limit !== undefined ? { limit: options.limit } : {}),
      ...params,
      ...(cursor ? { cursor } : {}),
    };
  }, [params, cursor, options?.limit]);

  const queryResult = queryHook(queryParams);

  const pagination = useCursorPagination<T>({
    data: queryResult?.data,
    isLoading: queryResult?.isLoading,
    isFetching: queryResult?.isFetching,
    cursor,
    setCursor,
    resetKey: params,
    ...options,
  });

  return {
    ...queryResult,
    ...pagination,
    items: pagination.combinedData,
    cursor,
    setCursor,
  };
}

export default useCursorPagination;
