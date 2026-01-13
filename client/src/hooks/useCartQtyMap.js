import { useCallback, useEffect, useState } from "react";

import { getCartSummary } from "../api/cartApi";
import { buildCartQtyMap } from "../utils/cartQtyMap";

export default function useCartQtyMap({ isLoggedIn }) {
  const [cartQtyByProductId, setCartQtyByProductId] = useState({});

  const refreshCartMap = useCallback(async () => {
    if (!isLoggedIn) {
      setCartQtyByProductId({});
      return;
    }

    try {
      const summary = await getCartSummary();
      const items = Array.isArray(summary?.items) ? summary.items : [];
      setCartQtyByProductId(buildCartQtyMap(items));
    } catch {
      setCartQtyByProductId({});
    }
  }, [isLoggedIn]);

  const bumpQty = useCallback((productId, delta) => {
    if (!productId) return;

    setCartQtyByProductId((prev) => {
      const pid = String(productId);
      const next = Number(prev?.[pid] || 0) + Number(delta || 0);

      return { ...prev, [pid]: Math.max(0, next) };
    });
  }, []);

  useEffect(() => {
    let alive = true;

    Promise.resolve().then(() => {
      if (!alive) return;
      refreshCartMap();
    });

    return () => {
      alive = false;
    };
  }, [refreshCartMap]);

  useEffect(() => {
    function onCartUpdated() {
      refreshCartMap();
    }

    window.addEventListener("ecostore_cart_updated", onCartUpdated);
    return () =>
      window.removeEventListener("ecostore_cart_updated", onCartUpdated);
  }, [refreshCartMap]);

  return { cartQtyByProductId, refreshCartMap, bumpQty };
}
