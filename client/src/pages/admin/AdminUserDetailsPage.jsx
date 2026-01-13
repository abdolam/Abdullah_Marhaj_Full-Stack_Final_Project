import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getUserById } from "../../api/usersApi";
import useToast from "../../hooks/useToast";

function formatUserName(user) {
  const name = user?.name;

  if (typeof name === "string" && name.trim()) return name.trim();

  if (name && typeof name === "object") {
    const full = [name.first, name.last].filter(Boolean).join(" ").trim();
    if (full) return full;
  }

  return "-";
}

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

function isUserBlocked(user) {
  if (user?.status && typeof user.status === "object")
    return Boolean(user.status.blocked);
  return Boolean(user?.blocked);
}

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [state, setState] = useState({
    status: "idle",
    user: null,
  });

  useEffect(() => {
    if (!id) return;

    let alive = true;

    queueMicrotask(() => {
      if (!alive) return;
      setState({ status: "loading", user: null });
    });

    getUserById(id)
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
  }, [id, showToast]);

  const addressLines = useMemo(
    () => formatAddress(state.user?.address),
    [state.user?.address]
  );

  const user = state.user || {};
  const blocked = isUserBlocked(user);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
        >
          <ArrowRight className="h-5 w-5" />
          חזרה לרשימת משתמשים
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          פרטי משתמש
        </h1>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          מזהה: <span dir="ltr">{id}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {state.status === "loading" ? (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            טוען פרטים...
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                שם
              </div>
              <div className="mt-1 text-sm font-semibold">
                {formatUserName(user)}
              </div>
            </div>

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
                טלפון
              </div>
              <div className="mt-1 text-sm font-semibold text-right">
                <span dir="ltr">{user.phone || "-"}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                סטטוס
              </div>
              <div className="mt-1">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    blocked
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
                  ].join(" ")}
                >
                  {blocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Admin
              </div>
              <div className="mt-1 text-sm font-semibold">
                {user.isAdmin ? "כן" : "לא"}
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
