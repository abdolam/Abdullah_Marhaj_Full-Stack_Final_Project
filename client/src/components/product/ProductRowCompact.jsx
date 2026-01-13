import { ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { toAbsoluteUrl } from "../../utils/mediaUrl";

export default function ProductRowCompact({
  product,
  isLoggedIn,
  onAddToCart,
}) {
  const productId = String(product?._id || "");
  const name = String(product?.name || "מוצר");

  const price = Number(product?.price || 0);

  const imgSrc = useMemo(() => {
    return toAbsoluteUrl(product?.image) || null;
  }, [product]);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) return;
    onAddToCart?.(productId, 1);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <Link
          to={`/products/${productId}`}
          className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          aria-label="מעבר למוצר"
          title="מעבר למוצר"
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
              אין תמונה
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={`/products/${productId}`}
              className="truncate text-sm font-bold text-brand-navy hover:underline dark:text-brand-gold"
              title={name}
            >
              {name}
            </Link>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-gold bg-brand-gold font-bold text-brand-navy hover:opacity-90"
              aria-label="הוסף לעגלה"
              title="הוסף לעגלה"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isLoggedIn ? "" : ""}
            </div>

            <div
              className="text-lg font-extrabold text-brand-navy dark:text-brand-gold"
              dir="ltr"
            >
              ₪{price.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
