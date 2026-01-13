import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getMyOrders } from "../api/ordersApi";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const highlightOrderNumber = location?.state?.highlightOrderNumber || "";
  const [state, setState] = useState({
    status: "idle",
    orders: [],
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    let alive = true;

    queueMicrotask(() => {
      if (!alive) return;
      setState({ status: "loading", orders: [] });
    });

    getMyOrders()
      .then((orders) => {
        if (!alive) return;
        setState({
          status: "ready",
          orders: Array.isArray(orders) ? orders : [],
        });
      })
      .catch(() => {
        if (!alive) return;
        setState({ status: "error", orders: [] });
        showToast("שגיאה בטעינת הזמנות", "error");
      });

    return () => {
      alive = false;
    };
  }, [isLoggedIn, showToast]);

  const orders = state.orders;

  const ordersCount = orders.length;

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          ההזמנות שלי
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          כדי לצפות בהזמנות צריך להתחבר.
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

  return (
    <div className="space-y-6">
      <Link
        to={"/account"}
        className=" text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowRight />
      </Link>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
            ההזמנות שלי
          </h1>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            סך הכל: {ordersCount}
          </div>
        </div>

        <Link
          to="/products"
          className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          המשך קניות
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          טוען הזמנות...
        </div>
      )}

      {state.status !== "loading" && orders.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          אין עדיין הזמנות.
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o, idx) => (
            <div
              key={String(o._id || o.createdAt || idx)}
              className={[
                "rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-950",
                highlightOrderNumber && o.orderNumber === highlightOrderNumber
                  ? "border-brand-gold"
                  : "border-slate-200 dark:border-slate-800",
              ].join(" ")}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-bold">
                  הזמנה{" "}
                  <span
                    className="text-slate-600 dark:text-slate-300"
                    dir="ltr"
                  >
                    {o.orderNumber || String(o._id || "").slice(-8) || "-"}
                  </span>
                </div>
                <div className="text-sm">
                  סטטוס:{" "}
                  <span className="font-semibold">{o.status || "pending"}</span>
                </div>
              </div>

              <div className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                <div>נוצרה: {formatDate(o.createdAt)}</div>
                <div>
                  פריטים:{" "}
                  {Array.isArray(o.items)
                    ? o.items.length
                    : o.itemsCount || "-"}
                </div>
                <div dir="ltr">
                  ₪ {`סה"כ: `}
                  <span>
                    {typeof o.total === "number"
                      ? o.total
                      : typeof o.totalPrice === "number"
                        ? o.totalPrice
                        : "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
