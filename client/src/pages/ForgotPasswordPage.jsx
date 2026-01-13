import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../api/usersApi";
import useToast from "../hooks/useToast";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const emailError = useMemo(() => {
    if (!email) return "";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return ok ? "" : "אימייל לא תקין";
  }, [email]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || emailError) return;

    setStatus("loading");
    try {
      await forgotPassword({ email });
      showToast("אם האימייל קיים במערכת, נשלח קישור לאיפוס סיסמה", "success");
      setStatus("done");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "שגיאה בשליחת קישור איפוס סיסמה";
      showToast(String(msg), "error");
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          שכחתי סיסמה
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          הזן אימייל ונשלח קישור לאיפוס סיסמה.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <label className="text-sm font-semibold">אימייל</label>
        <input
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
          placeholder="name@example.com"
        />
        {emailError && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">
            {emailError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !email || !!emailError}
          className="mt-4 w-full rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy disabled:opacity-50"
        >
          {status === "loading" ? "שולח..." : "שלח קישור"}
        </button>

        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          חזרה ל{" "}
          <Link to="/login" className="font-bold underline">
            התחברות
          </Link>
        </div>
      </form>

      {status === "done" && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          אם האימייל קיים במערכת, נשלח קישור לאיפוס סיסמה.
        </div>
      )}
    </div>
  );
}
