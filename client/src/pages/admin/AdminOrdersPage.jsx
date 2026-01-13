import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllOrders, updateOrderStatus } from "../../api/ordersApi";
import useToast from "../../hooks/useToast";

const STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"];

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

function formatUserLabel(user) {
  if (!user) return "-";

  if (typeof user === "string") return user;

  // populated user object
  const email = user.email ? String(user.email) : "";
  const name =
    typeof user.name === "string"
      ? user.name
      : user.name && typeof user.name === "object"
        ? [user.name.first, user.name.last].filter(Boolean).join(" ")
        : "";

  return name || email || String(user._id || "");
}

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(2);
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();

  const [state, setState] = useState({
    status: "loading",
    orders: [],
  });

  function load() {
    setState((p) => ({ ...p, status: "loading" }));
    getAllOrders()
      .then((data) => {
        setState({
          status: "ready",
          orders: Array.isArray(data) ? data : [],
        });
      })
      .catch(() => {
        setState({ status: "error", orders: [] });
        showToast("שגיאה בטעינת הזמנות", "error");
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onChangeStatus(orderId, nextStatus) {
    try {
      await updateOrderStatus(orderId, nextStatus);
      showToast("סטטוס ההזמנה עודכן", "success");
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה בעדכון סטטוס";
      showToast(String(msg), "error");
    }
  }

  const orders = state.orders || [];

  return (
    <div className="space-y-6">
      <Link
        to={"/admin"}
        className=" text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowRight />
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          ניהול הזמנות
        </h1>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          סך הכל: {orders.length}
        </div>
      </div>

      {state.status === "loading" && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          טוען הזמנות...
        </div>
      )}

      {state.status !== "loading" && orders.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          אין הזמנות.
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    סטטוס
                  </span>
                  <select
                    value={o.status || "pending"}
                    onChange={(e) => onChangeStatus(o._id, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm dark:bg-slate-900 dark:border-slate-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-4">
                <div>נוצרה: {formatDate(o.createdAt)}</div>
                <div>
                  משתמש: <span dir="ltr">{formatUserLabel(o.user)}</span>
                </div>
                <div>
                  פריטים:{" "}
                  {Array.isArray(o.items)
                    ? o.items.length
                    : o.itemsCount || "-"}
                </div>
                <div dir="ltr">
                  לתשלום: <span>₪{formatMoney(o.total ?? o.subtotal)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
