import { Menu, Moon, Search, ShoppingCart, User, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCartSummary } from "../api/cartApi";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import useToast from "../hooks/useToast";

import RateLimitModal from "./common/RateLimitModal";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const lastAuthToastRef = useRef(0);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateModalMsg, setRateModalMsg] = useState("");
  const refreshCartQty = useCallback(async () => {
    if (!isLoggedIn) {
      setCartQty(0);
      return;
    }

    try {
      const summary = await getCartSummary();
      const items = Array.isArray(summary?.items) ? summary.items : [];
      const totalQty = items.reduce((sum, item) => {
        return sum + Number(item?.quantity || 0);
      }, 0);

      setCartQty(totalQty);
    } catch {
      setCartQty(0);
    }
  }, [isLoggedIn]);

  const RATE_KEY = "ecostore_rate_limited_until";

  const tomorrowIsoLocal = useCallback(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const setRateLimitedUntilTomorrow = useCallback(() => {
    localStorage.setItem(RATE_KEY, tomorrowIsoLocal());
  }, [tomorrowIsoLocal]);

  const isRateLimitedNow = useCallback(() => {
    const raw = localStorage.getItem(RATE_KEY);
    if (!raw) return false;

    const t = new Date(raw).getTime();
    return Number.isFinite(t) && Date.now() < t;
  }, []);

  // Check persisted rate limit only on mount (no impure calls during render)
  useEffect(() => {
    let alive = true;

    Promise.resolve().then(() => {
      if (!alive) return;

      const raw = localStorage.getItem(RATE_KEY);
      if (!raw) return;

      const t = new Date(raw).getTime();
      if (Number.isFinite(t) && Date.now() < t) {
        setRateModalMsg("חרגת ממספר הבקשות היומי. נסה שוב מחר.");
        setRateModalOpen(true);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    function onRateLimited(e) {
      // Persist block until tomorrow 00:00
      setRateLimitedUntilTomorrow();

      // Force logout (your preference)
      logout();
      setCartQty(0);

      const serverMsg = e?.detail?.message;
      setRateModalMsg(
        serverMsg
          ? String(serverMsg)
          : "חרגת ממספר הבקשות היומי. לא ניתן לבצע פעולות נוספות. נסה שוב מחר."
      );
      setRateModalOpen(true);
    }

    window.addEventListener("ecostore_rate_limited", onRateLimited);
    return () =>
      window.removeEventListener("ecostore_rate_limited", onRateLimited);
  }, [logout, setRateLimitedUntilTomorrow]);

  useEffect(() => {
    let alive = true;

    Promise.resolve().then(async () => {
      if (!alive) return;
      await refreshCartQty();
    });

    return () => {
      alive = false;
    };
  }, [refreshCartQty, isLoggedIn]);

  useEffect(() => {
    function onAuthInvalid() {
      if (!isLoggedIn) return;

      const now = Date.now();
      if (now - lastAuthToastRef.current < 1500) return;
      lastAuthToastRef.current = now;

      showToast("החיבור פג תוקף. התחבר שוב.", "error");
      navigate("/login", { replace: true });
    }

    window.addEventListener("ecostore_auth_invalid", onAuthInvalid);

    return () => {
      window.removeEventListener("ecostore_auth_invalid", onAuthInvalid);
    };
  }, [isLoggedIn, navigate, showToast]);

  useEffect(() => {
    function onCartUpdated() {
      refreshCartQty();
    }

    window.addEventListener("ecostore_cart_updated", onCartUpdated);
    return () =>
      window.removeEventListener("ecostore_cart_updated", onCartUpdated);
  }, [refreshCartQty, isLoggedIn]);

  const accountMenu = useMemo(() => {
    if (!isLoggedIn) {
      return [
        { label: "התחברות", to: "/login" },
        { label: "הרשמה", to: "/register" },
      ];
    }

    const items = [{ label: "אזור אישי", to: "/account" }];

    if (isAdmin) items.push({ label: "ניהול", to: "/admin" });

    items.push({ label: "התנתקות", action: "logout" });

    return items;
  }, [isLoggedIn, isAdmin]);

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    navigate(`/products?q=${encodeURIComponent(q)}`);
  }

  function onCartClick() {
    if (isRateLimitedNow()) {
      setRateModalMsg("חרגת ממספר הבקשות היומי. נסה שוב מחר.");
      setRateModalOpen(true);
      return;
    }

    if (!isLoggedIn) {
      showToast("כדי לצפות בעגלה צריך להתחבר", "error");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    navigate("/cart");
  }

  function onAccountItemClick(item) {
    setAccountOpen(false);

    if (item.action === "logout") {
      logout();
      showToast("התנתקת מהמערכת", "success");
      navigate("/", { replace: true });
      return;
    }

    if (item.to) navigate(item.to);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-5">
        <Link
          to="/"
          className="rounded-md px-2 py-1 text-lg font-bold text-brand-navy dark:text-brand-gold"
        >
          EcoStore
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900 lg:hidden"
          aria-label="תפריט"
          title="תפריט"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <nav className="hidden items-center gap-3 lg:flex">
          <Link
            className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/"
          >
            דף הבית
          </Link>
          <Link
            className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/products"
          >
            מוצרים
          </Link>
          <Link
            className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/about"
          >
            אודות
          </Link>
          <Link
            className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900"
            to="/contact"
          >
            צור קשר
          </Link>

          {isAdmin && (
            <Link
              className="rounded bg-brand-gold px-2 py-1 font-semibold text-brand-navy hover:opacity-90"
              to="/admin"
            >
              ניהול
            </Link>
          )}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <form onSubmit={onSubmit} className="relative hidden sm:block me-8">
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="חיפוש"
              title="חיפוש"
            >
              <Search className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש מוצרים..."
              className="w-72 rounded-lg border border-slate-300 bg-white py-2 ps-3 pe-11 text-sm focus:border-brand-gold focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </form>

          <div className="relative">
            <button
              type="button"
              onClick={onCartClick}
              className="rounded-lg bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-gold hover:text-brand-navy dark:text-white"
              aria-label="עגלה"
              title="עגלה"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>

            {cartQty > 0 && (
              <span className="absolute -top-2.5 -right-2.5 min-w-5 rounded-full bg-brand-gold px-1 py-0.5 text-center text-[10px] font-bold text-brand-navy">
                {cartQty}
              </span>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
              aria-label="חשבון"
              title="חשבון"
            >
              <User className="h-4 w-4" />
            </button>

            {accountOpen && (
              <div
                className="absolute left-0 mt-2 w-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
                onMouseLeave={() => setAccountOpen(false)}
              >
                {accountMenu.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onAccountItemClick(item)}
                    className="block w-full px-8 py-2 text-centre text-sm hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
            aria-label="מצב כהה"
            title="מצב כהה"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto w-full text-center max-w-6xl px-4 pb-3 lg:hidden">
          <nav className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
            <Link
              className="rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              to="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              דף הבית
            </Link>
            <Link
              className="rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
            >
              מוצרים
            </Link>
            <Link
              className="rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              אודות
            </Link>
            <Link
              className="rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              צור קשר
            </Link>

            {isAdmin && (
              <Link
                className="rounded bg-brand-gold px-3 py-2 text-center font-semibold text-brand-navy hover:opacity-90"
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
              >
                ניהול
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Mobile search */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:hidden">
        <form onSubmit={onSubmit} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש מוצרים..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 ps-3 pe-9 text-sm focus:border-brand-gold focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </form>
      </div>

      <RateLimitModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        message={rateModalMsg}
      />
    </header>
  );
}
