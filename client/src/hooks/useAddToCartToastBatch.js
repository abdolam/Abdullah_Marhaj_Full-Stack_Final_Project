import { useEffect, useRef } from "react";

export default function useAddToCartToastBatch({ showToast, delayMs = 700 }) {
  const timerRef = useRef(null);
  const pendingRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  function bumpSuccess(qty) {
    pendingRef.current += Number(qty || 0);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const added = pendingRef.current;
      pendingRef.current = 0;

      if (added > 0) showToast("נוסף לעגלה", "success");
    }, delayMs);
  }

  return { bumpSuccess };
}
