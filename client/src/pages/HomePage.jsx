import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { addToCart } from "../api/cartApi";
import { getAllProducts } from "../api/productsApi";
import HomeFeaturedProducts from "../components/home/HomeFeaturedProducts";
import HomeHero from "../components/home/HomeHero";
import HomeWhyEco from "../components/home/HomeWhyEco";
import useAddToCartToastBatch from "../hooks/useAddToCartToastBatch";
import useAuth from "../hooks/useAuth";
import useCartQtyMap from "../hooks/useCartQtyMap";
import useToast from "../hooks/useToast";

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartQtyByProductId, bumpQty } = useCartQtyMap({ isLoggedIn });
  const { bumpSuccess } = useAddToCartToastBatch({ showToast, delayMs: 700 });

  const [productsStatus, setProductsStatus] = useState("loading"); // loading | ready | error
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setProductsStatus("loading");
      try {
        const data = await getAllProducts();
        if (!alive) return;

        const list = Array.isArray(data) ? data : data?.items || [];
        setAllProducts(list);
        setProductsStatus("ready");
      } catch {
        if (!alive) return;
        setAllProducts([]);
        setProductsStatus("error");
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts : [];

    // Prefer active products if the field exists, otherwise use list as-is
    const active = list.filter((p) => p?.isActive !== false);
    const base = active.length ? active : list;

    // Keep it simple: first 4
    return base.slice(0, 4);
  }, [allProducts]);

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

  return (
    <div className="space-y-10">
      <HomeHero />

      <HomeFeaturedProducts
        products={featuredProducts}
        status={productsStatus}
        isLoggedIn={isLoggedIn}
        onAddToCart={handleAddToCart}
        cartQtyByProductId={cartQtyByProductId}
      />

      <HomeWhyEco />
    </div>
  );
}
