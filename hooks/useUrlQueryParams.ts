"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string, defaultValue?: string) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (value && value !== defaultValue) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }

      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return { params, updateParam };
}
