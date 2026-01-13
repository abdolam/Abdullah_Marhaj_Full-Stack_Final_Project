import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { addToCart } from "../api/cartApi";
import useAuth from "../hooks/useAuth";
import useProductById from "../hooks/useProductById";
import useToast from "../hooks/useToast";
import { toAbsoluteUrl } from "../utils/mediaUrl";

export default function ProductDetailsPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { product, status } = useProductById(id);

  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const img = useMemo(() => toAbsoluteUrl(product?.image) || null, [product]);
  const name = String(product?.name || "מוצר");
  const description = String(product?.description || "");
  const price = Number(product?.price || 0);

  // Reset qty when product changes (avoid ESLint warning)
  useEffect(() => {
    if (!product?._id) return;

    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      setQty(1);
    });

    return () => {
      alive = false;
    };
  }, [product?._id]);

  // Not found -> redirect after short delay
  useEffect(() => {
    if (status !== "notfound") return;

    const t = setTimeout(() => {
      navigate("/products", { replace: true });
    }, 2000);

    return () => clearTimeout(t);
  }, [status, navigate]);

  async function handleAddToCart() {
    if (!product?._id) return;

    if (!isLoggedIn) {
      showToast("כדי להוסיף לעגלה צריך להתחבר", "error");
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }

    const safeQty = Math.max(1, Math.floor(Number(qty) || 1));

    setIsAdding(true);
    try {
      await addToCart(product._id, safeQty);
      showToast("נוסף לעגלה", "success");
      window.dispatchEvent(new Event("ecostore_cart_updated"));
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה בהוספה לעגלה";
      showToast(String(msg), "error");
    } finally {
      setIsAdding(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl text-sm text-slate-600 dark:text-slate-300">
        טוען מוצר...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl text-sm text-rose-700 dark:text-rose-200">
        שגיאה בטעינת מוצר
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-3">
        <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
          מוצר לא נמצא
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          מעבירים לרשימת מוצרים...
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Link
        to="/products"
        className="text-sm font-bold text-brand-navy hover:underline dark:text-brand-gold"
      >
        חזרה למוצרים
      </Link>
      <div className="grid gap-6 pt-5 lg:grid-cols-2 lg:items-start">
        {/* Media */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          {img ? (
            <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
              <img
                src={img}
                alt={name}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              אין תמונה
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h1 className="text-2xl font-extrabold text-brand-navy dark:text-brand-gold">
              {name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div
                className="text-2xl font-extrabold text-brand-navy dark:text-brand-gold"
                dir="ltr"
              >
                ₪{price.toFixed(2)}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                מחיר כולל מע״מ
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                כמות
              </div>

              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="h-10 w-28 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                dir="ltr"
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={[
                "mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold transition",
                isAdding
                  ? "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy",
              ].join(" ")}
            >
              {isAdding ? "מוסיף..." : "הוספה לעגלה"}
            </button>

            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              הוספה לעגלה אינה מבצעת חיוב, ניתן לשנות כמות בעמוד העגלה.
            </div>
          </div>

          {/* Description */}
          {description ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <div className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                תיאור מוצר
              </div>
              <div className="leading-6">{description}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
