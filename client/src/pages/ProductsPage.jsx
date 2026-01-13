import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { addToCart } from "../api/cartApi";
import { getAllProducts } from "../api/productsApi";
import ProductCard from "../components/product/ProductCard";
import useAddToCartToastBatch from "../hooks/useAddToCartToastBatch";
import useAuth from "../hooks/useAuth";
import useCartQtyMap from "../hooks/useCartQtyMap";
import useProductsQueryParams from "../hooks/useProductsQueryParams";
import useToast from "../hooks/useToast";

import ProductRowCompact from "./../components/product/ProductRowCompact";

function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

function safeNum(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export default function ProductsPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { q, sort, view, setParams } = useProductsQueryParams();
  const { cartQtyByProductId, bumpQty } = useCartQtyMap({ isLoggedIn });
  const { bumpSuccess } = useAddToCartToastBatch({ showToast, delayMs: 700 });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setStatus("loading");
      try {
        const data = await getAllProducts();
        if (!alive) return;

        const list = Array.isArray(data) ? data : data?.items || [];
        setProducts(list);
        setStatus("ready");
      } catch {
        if (!alive) return;
        setProducts([]);
        setStatus("error");
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  async function handleAddToCart(productId, qty) {
    if (!productId) return;

    if (!isLoggedIn) {
      showToast("כדי להוסיף לעגלה צריך להתחבר", "error");
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }

    try {
      await addToCart(productId, qty);

      bumpQty(String(productId), Number(qty || 0));
      bumpSuccess(Number(qty || 0));

      window.dispatchEvent(new Event("ecostore_cart_updated"));
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        "הוספה לעגלה נכשלה. נסה שוב.";

      showToast(String(serverMsg), "error");
    }
  }

  const filteredSorted = useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    const qn = norm(q);

    let out = list;

    if (qn) {
      out = out.filter((p) => {
        const name = norm(p?.name);
        const desc = norm(p?.shortDescription);
        const catNo = norm(p?.catalogueNumber);
        return (
          name.includes(qn) ||
          desc.includes(qn) ||
          (catNo && catNo.includes(qn))
        );
      });
    }

    function basePrice(p) {
      return safeNum(p?.price);
    }

    if (sort === "priceAsc") {
      out.sort((a, b) => basePrice(a) - basePrice(b));
    } else if (sort === "priceDesc") {
      out.sort((a, b) => basePrice(b) - basePrice(a));
    } else if (sort === "nameAsc") {
      out.sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), "he")
      );
    } else if (sort === "nameDesc") {
      out.sort((a, b) =>
        String(b?.name || "").localeCompare(String(a?.name || ""), "he")
      );
    } else {
      // relevance (default): keep original order
    }

    return out;
  }, [products, q, sort]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          טוען מוצרים...
        </h1>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          שגיאה בטעינת מוצרים
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          נסה שוב מאוחר יותר.
        </p>
      </div>
    );
  }

  const isList = view === "list";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
            מוצרים
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            בחר מוצר והוסף לעגלה.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search indicator (Navbar is the search input) */}
          {q && (
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                תוצאות חיפוש: <span className="font-bold">{`"${q}"`}</span>
              </div>

              <button
                type="button"
                onClick={() => setParams({ q: "" })}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                נקה
              </button>
            </div>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setParams({ sort: e.target.value })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            aria-label="מיון"
          >
            <option value="relevance">ברירת מחדל</option>
            <option value="priceAsc">מחיר: נמוך לגבוה</option>
            <option value="priceDesc">מחיר: גבוה לנמוך</option>
            <option value="nameAsc">שם: א-ת</option>
            <option value="nameDesc">שם: ת-א</option>
          </select>

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setParams({ view: "grid" })}
              className={[
                "px-3 py-2 text-sm font-bold",
                !isList
                  ? "bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy"
                  : "bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900",
              ].join(" ")}
            >
              כרטיסים
            </button>
            <button
              type="button"
              onClick={() => setParams({ view: "list" })}
              className={[
                "px-3 py-2 text-sm font-bold",
                isList
                  ? "bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy"
                  : "bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900",
              ].join(" ")}
            >
              רשימה
            </button>
          </div>
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          לא נמצאו מוצרים.
        </div>
      ) : isList ? (
        <div className="space-y-2">
          {filteredSorted.map((p) => (
            <ProductRowCompact
              key={String(p?._id)}
              product={p}
              onAddToCart={handleAddToCart}
              inCartQty={Number(cartQtyByProductId?.[String(p?._id)] || 0)}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSorted.map((p) => (
            <ProductCard
              key={String(p?._id)}
              product={p}
              onAddToCart={handleAddToCart}
              inCartQty={Number(cartQtyByProductId?.[String(p?._id)] || 0)}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}
