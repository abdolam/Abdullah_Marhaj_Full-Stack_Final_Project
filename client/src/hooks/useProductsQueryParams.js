import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useProductsQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance"; // relevance | priceAsc | priceDesc | nameAsc | nameDesc
  const view = searchParams.get("view") || "grid"; // grid | list

  const setParams = useCallback(
    (next) => {
      const sp = new URLSearchParams(searchParams);

      Object.entries(next).forEach(([k, v]) => {
        const val = String(v ?? "").trim();

        if (
          !val ||
          (k === "sort" && val === "relevance") ||
          (k === "view" && val === "grid")
        ) {
          sp.delete(k);
        } else {
          sp.set(k, val);
        }
      });

      setSearchParams(sp, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return { q, sort, view, setParams };
}
