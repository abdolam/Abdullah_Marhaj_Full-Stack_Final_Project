import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../api/usersApi";
import useToast from "../hooks/useToast";

export default function ResetPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading

  const passwordError = useMemo(() => {
    if (!newPassword) return "";
    if (newPassword.length < 8) return "סיסמה חייבת להכיל לפחות 8 תווים";
    return "";
  }, [newPassword]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!token) {
      showToast("קישור איפוס לא תקין (חסר token)", "error");
      return;
    }
    if (!newPassword || passwordError) return;

    setStatus("loading");
    try {
      await resetPassword({ token, newPassword });
      showToast("הסיסמה עודכנה בהצלחה", "success");
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה באיפוס סיסמה";
      showToast(String(msg), "error");
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          איפוס סיסמה
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          הזן סיסמה חדשה.
        </p>
      </div>

      {!token && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          קישור איפוס לא תקין.
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <label className="text-sm font-semibold">סיסמה חדשה</label>
        <input
          type="password"
          dir="ltr"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
          placeholder="••••••••"
        />
        {passwordError && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={
            status === "loading" || !token || !newPassword || !!passwordError
          }
          className="mt-4 w-full rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy disabled:opacity-50"
        >
          {status === "loading" ? "מעדכן..." : "עדכן סיסמה"}
        </button>

        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          חזרה ל{" "}
          <Link to="/login" className="font-bold underline">
            התחברות
          </Link>
        </div>
      </form>
    </div>
  );
}
