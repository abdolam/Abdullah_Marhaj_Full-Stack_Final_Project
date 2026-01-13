import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getUserById } from "../api/usersApi";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

function formatAddress(address) {
  if (!address || typeof address !== "object") return null;

  const city = address.city || address.town || address.locality || "";
  const street = address.street || "";
  const houseNumber =
    address.houseNumber || address.houseNo || address.number || "";
  const apt = address.apartment || address.apartmentNumber || address.apt || "";
  const zip = address.zip || address.zipCode || address.postalCode || "";

  const line1 = [street, houseNumber].filter(Boolean).join(" ");
  const line2 = [city, zip].filter(Boolean).join(", ");
  const line3 = apt ? `דירה ${apt}` : "";

  const lines = [line1, line3, line2].filter(Boolean);
  return lines.length ? lines : null;
}

export default function ProfilePage() {
  const { isLoggedIn, payload, isAdmin } = useAuth();
  const { showToast } = useToast();

  const userId = payload?._id || "";

  const [state, setState] = useState({
    status: "idle",
    user: null,
  });

  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    let alive = true;

    queueMicrotask(() => {
      if (!alive) return;
      setState({ status: "loading", user: null });
    });

    getUserById(userId)
      .then((u) => {
        if (!alive) return;
        setState({ status: "ready", user: u });
      })
      .catch(() => {
        if (!alive) return;
        setState({ status: "error", user: null });
        showToast("שגיאה בטעינת פרטי משתמש", "error");
      });

    return () => {
      alive = false;
    };
  }, [isLoggedIn, userId, showToast]);

  // Hooks must be called unconditionally (before any early returns)
  const addressLines = useMemo(
    () => formatAddress(state.user?.address),
    [state.user?.address]
  );

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          הפרופיל שלי
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          כדי לצפות בפרופיל צריך להתחבר.
        </p>
        <Link
          to="/login"
          className="inline-flex rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
        >
          התחברות
        </Link>
      </div>
    );
  }

  const user = state.user || {};

  return (
    <div className="space-y-6">
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowRight className="h-5 w-5" />
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          הפרופיל שלי
        </h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {state.status === "loading" && (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            טוען פרטים...
          </div>
        )}

        {state.status !== "loading" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                אימייל
              </div>
              <div className="mt-1 text-sm font-semibold text-right">
                <span dir="ltr">{user.email || "-"}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                הרשאות
              </div>
              <div className="mt-1 text-sm font-semibold">
                {isAdmin ? "Admin" : "User"}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                שם
              </div>
              <div className="mt-1 text-sm font-semibold">
                {typeof user.name === "string"
                  ? user.name
                  : user.name && typeof user.name === "object"
                    ? [user.name.first, user.name.last]
                        .filter(Boolean)
                        .join(" ") || "-"
                    : "-"}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                טלפון
              </div>
              <div className="mt-1 text-sm font-semibold text-right">
                <span dir="ltr">{user.phone || "-"}</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                כתובת
              </div>

              {addressLines ? (
                <div className="mt-1 space-y-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {addressLines.map((line, idx) => (
                    <div key={`${idx}-${line}`}>{line}</div>
                  ))}
                </div>
              ) : (
                <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  לא הוזנה כתובת
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
