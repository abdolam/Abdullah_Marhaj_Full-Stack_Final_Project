import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { listUsers } from "../../api/usersApi";
import useToast from "../../hooks/useToast";
import { ArrowRight } from "lucide-react";

function looksLikeUsersArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.some(
    (x) => x && typeof x === "object" && (x._id || x.id || x.email)
  );
}

function deepExtractUsers(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const direct = [
    payload.items,
    payload.users,
    payload.results,
    payload.data,
    payload.rows,
    payload.docs,
  ];
  for (const c of direct) if (looksLikeUsersArray(c)) return c;

  const nested = [
    payload.data?.items,
    payload.data?.users,
    payload.data?.results,
    payload.result?.items,
    payload.result?.users,
    payload.result?.results,
    payload.payload?.items,
    payload.payload?.users,
    payload.payload?.results,
  ];
  for (const c of nested) if (looksLikeUsersArray(c)) return c;

  const queue = [{ value: payload, depth: 0 }];
  const visited = new Set();

  while (queue.length) {
    const { value, depth } = queue.shift();
    if (!value || typeof value !== "object") continue;
    if (visited.has(value)) continue;
    visited.add(value);

    if (Array.isArray(value) && looksLikeUsersArray(value)) return value;
    if (depth >= 3) continue;

    for (const key of Object.keys(value)) {
      queue.push({ value: value[key], depth: depth + 1 });
    }
  }

  return [];
}

function formatUserName(user) {
  const name = user?.name;
  if (typeof name === "string" && name.trim()) return name.trim();
  if (name && typeof name === "object") {
    const full = [name.first, name.last].filter(Boolean).join(" ").trim();
    if (full) return full;
  }
  return "-";
}

function isUserBlocked(user) {
  if (user?.status && typeof user.status === "object")
    return Boolean(user.status.blocked);
  return Boolean(user?.blocked);
}

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [state, setState] = useState({
    status: "idle",
    users: [],
  });

  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;

    queueMicrotask(() => {
      if (!alive) return;
      setState({ status: "loading", users: [] });
    });

    listUsers({ page: 1, limit: 50 })
      .then((data) => {
        if (!alive) return;
        setState({ status: "ready", users: deepExtractUsers(data) });
      })
      .catch(() => {
        if (!alive) return;
        setState({ status: "error", users: [] });
        showToast("שגיאה בטעינת משתמשים", "error");
      });

    return () => {
      alive = false;
    };
  }, [showToast]);

  const filtered = useMemo(() => {
    const query = String(q || "")
      .trim()
      .toLowerCase();
    if (!query) return state.users;

    return state.users.filter((u) => {
      const email = String(u?.email || "").toLowerCase();
      const name = formatUserName(u).toLowerCase();
      const blocked = isUserBlocked(u) ? "blocked" : "active";
      return (
        email.includes(query) || name.includes(query) || blocked.includes(query)
      );
    });
  }, [q, state.users]);

  return (
    <div className="space-y-6">
      <Link
        to={"/admin"}
        className=" text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowRight />
      </Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
            משתמשים
          </h1>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            צפייה בלבד
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            רשימת משתמשים
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי אימייל / שם / blocked"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-80"
          />
        </div>

        {state.status === "loading" ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            טוען משתמשים...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            לא נמצאו משתמשים.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-slate-500 dark:text-slate-400">
                  <th className="py-2">שם</th>
                  <th className="py-2">אימייל</th>
                  <th className="py-2">Admin</th>
                  <th className="py-2">סטטוס</th>
                  <th className="py-2">פעולה</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const id = u._id || u.id;
                  const blocked = isUserBlocked(u);

                  return (
                    <tr
                      key={String(
                        id ||
                          u.email ||
                          `${formatUserName(u)}-${String(u.phone || "")}-${String(u.createdAt || "")}-${String(u.updatedAt || "")}`
                      )}
                      className="border-t border-slate-200 dark:border-slate-800"
                    >
                      <td className="py-3 font-semibold">
                        {formatUserName(u)}
                      </td>
                      <td className="py-3">
                        <span dir="ltr">{u.email || "-"}</span>
                      </td>
                      <td className="py-3">{u.isAdmin ? "כן" : "לא"}</td>
                      <td className="py-3">
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
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          disabled={!id}
                          onClick={() => navigate(`/admin/users/${id}`)}
                          className={[
                            "inline-flex rounded-xl px-3 py-1.5 text-xs font-bold",
                            id
                              ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"
                              : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-900 dark:text-slate-500",
                          ].join(" ")}
                        >
                          צפייה
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
