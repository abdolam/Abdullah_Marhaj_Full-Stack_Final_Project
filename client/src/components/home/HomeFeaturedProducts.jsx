import { Link } from "react-router-dom";

import ProductCard from "../product/ProductCard";

export default function HomeFeaturedProducts({
  products,
  status, // NEW: loading | ready | error
  isLoggedIn,
  onAddToCart,
  cartQtyByProductId,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy dark:text-brand-gold">
            מוצרים מומלצים
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            כמה מוצרים שכדאי להכיר. אפשר לעבור לעמוד המוצרים כדי לראות את הכל.
          </p>
        </div>

        <Link
          to="/products"
          className="text-sm font-bold text-brand-navy hover:underline dark:text-brand-gold"
        >
          לכל המוצרים
        </Link>
      </div>

      {status === "loading" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          טוען מוצרים...
        </div>
      ) : status === "error" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          לא ניתן לטעון מוצרים כרגע. נסה שוב מאוחר יותר.
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          אין מוצרים להצגה כרגע.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={String(p?._id)}
              product={p}
              onAddToCart={onAddToCart}
              isLoggedIn={isLoggedIn}
              inCartQty={Number(cartQtyByProductId?.[String(p?._id)] || 0)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
