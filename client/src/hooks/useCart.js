import { useCallback, useEffect, useMemo, useState } from "react";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";

function normalizeQty(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

export default function useCart({ isLoggedIn, onAuthRequired, showToast }) {
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [busyMap, setBusyMap] = useState({}); // productId -> boolean

  const items = useMemo(() => {
    const list = Array.isArray(cart?.items) ? cart.items : [];
    return list;
  }, [cart]);

  const totals = useMemo(() => {
    return {
      originalSubtotal: Number(cart?.originalSubtotal ?? 0),
      subtotal: Number(cart?.subtotal ?? 0),
      total: Number(cart?.total ?? 0),
    };
  }, [cart]);

  const setBusy = useCallback((productId, v) => {
    setBusyMap((prev) => ({ ...prev, [String(productId)]: Boolean(v) }));
  }, []);

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setCart(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      const data = await getCart();
      setCart(data);
      setStatus("ready");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setStatus("error");
      setCart(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const syncBadge = useCallback(() => {
    window.dispatchEvent(new Event("ecostore_cart_updated"));
  }, []);

  const inc = useCallback(
    async (productId, currentQty) => {
      if (!isLoggedIn) {
        onAuthRequired();
        return;
      }

      const nextQty = Number(currentQty || 0) + 1;
      setBusy(productId, true);

      try {
        const res = await updateCartItem(productId, nextQty);
        setCart(res?.cart || null);
        syncBadge();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "עדכון כמות נכשל. נסה שוב.";
        showToast(String(msg), "error");
      } finally {
        setBusy(productId, false);
      }
    },
    [isLoggedIn, onAuthRequired, setBusy, showToast, syncBadge]
  );

  const dec = useCallback(
    async (productId, currentQty) => {
      if (!isLoggedIn) {
        onAuthRequired();
        return;
      }

      const nextQty = Math.max(1, Number(currentQty || 1) - 1);
      setBusy(productId, true);

      try {
        const res = await updateCartItem(productId, nextQty);
        setCart(res?.cart || null);
        syncBadge();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "עדכון כמות נכשל. נסה שוב.";
        showToast(String(msg), "error");
      } finally {
        setBusy(productId, false);
      }
    },
    [isLoggedIn, onAuthRequired, setBusy, showToast, syncBadge]
  );

  const setQtyFromInput = useCallback(
    async (productId, rawValue, fallbackQty) => {
      if (!isLoggedIn) {
        onAuthRequired();
        return;
      }

      const parsed = normalizeQty(rawValue);
      if (parsed === null || parsed < 1) {
        // If invalid input, do not call server. Caller can restore fallback.
        return { applied: false };
      }

      if (parsed === Number(fallbackQty || 0)) {
        return { applied: false };
      }

      setBusy(productId, true);
      try {
        const res = await updateCartItem(productId, parsed);
        setCart(res?.cart || null);
        syncBadge();
        return { applied: true };
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "עדכון כמות נכשל. נסה שוב.";
        showToast(String(msg), "error");
        return { applied: false, error: true };
      } finally {
        setBusy(productId, false);
      }
    },
    [isLoggedIn, onAuthRequired, setBusy, showToast, syncBadge]
  );

  const remove = useCallback(
    async (productId) => {
      if (!isLoggedIn) {
        onAuthRequired();
        return;
      }

      setBusy(productId, true);
      try {
        const res = await removeCartItem(productId);
        setCart(res?.cart || null);
        syncBadge();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "הסרת פריט נכשלה. נסה שוב.";
        showToast(String(msg), "error");
      } finally {
        setBusy(productId, false);
      }
    },
    [isLoggedIn, onAuthRequired, setBusy, showToast, syncBadge]
  );

  const clear = useCallback(async () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setStatus("loading");
    try {
      const res = await clearCart();
      setCart(res?.cart || null);
      setStatus("ready");
      syncBadge();
    } catch (err) {
      setStatus("error");
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        "ניקוי עגלה נכשל. נסה שוב.";
      showToast(String(msg), "error");
    }
  }, [isLoggedIn, onAuthRequired, showToast, syncBadge]);

  return {
    cart,
    items,
    totals,
    status,
    busyMap,
    load,
    inc,
    dec,
    setQtyFromInput,
    remove,
    clear,
  };
}
