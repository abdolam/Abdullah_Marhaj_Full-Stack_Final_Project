import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { toAbsoluteUrl } from "../../utils/mediaUrl";

export default function ProductCard({ product, onAddToCart }) {
  const id = product?._id;
  const name = product?.name || "מוצר";
  const description = product?.description || "";
  const price = Number(product?.price || 0);
  const img = toAbsoluteUrl(product?.image) || null;

  function handleAddClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(id, 1);
  }

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <Link to={`/products/${id}`} className="block">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          {img ? (
            <img src={img} alt={name} className="h-70 w-full object-cover" />
          ) : (
            <div className="flex h-70 w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
              אין תמונה
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="text-base font-bold text-brand-navy dark:text-brand-gold">
            {name}
          </div>

          {description ? (
            <div className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {description}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-right">
              <div
                className="text-lg font-bold text-brand-navy dark:text-brand-gold"
                dir="ltr"
              >
                ₪{price.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-brand-gold text-brand-navy hover:opacity-90 dark:border-slate-800"
                aria-label="הוספה לעגלה"
                title="הוספה לעגלה"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
