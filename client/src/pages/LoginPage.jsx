import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../api/usersApi";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { validateLogin } from "../utils/userValidation";

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">{msg}</p>;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lockInfo, setLockInfo] = useState({ isLocked: false, untilText: "" });
  const { login } = useAuth();
  const { showToast } = useToast();
  const from = location.state?.from || "/";
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errors = useMemo(() => validateLogin(values), [values]);
  const canSubmit =
    Object.keys(errors).length === 0 && !isSubmitting && !lockInfo.isLocked;

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (lockInfo.isLocked) setLockInfo({ isLocked: false, untilText: "" });
  }

  function touch(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function onSubmit(e) {
    if (lockInfo.isLocked) return;
    e.preventDefault();

    setTouched({ email: true, password: true });

    const finalErrors = validateLogin(values);
    if (Object.keys(finalErrors).length > 0) {
      showToast("יש לתקן את השדות המסומנים", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({
        email: values.email.trim(),
        password: values.password,
      });

      const token = data?.token;
      if (!token) {
        showToast("התחברות נכשלה. נסה שוב.", "error");
        return;
      }

      login(token);
      showToast("התחברת בהצלחה", "success");

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      const status = err?.response?.status;

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        "";

      const m = String(msg || "");

      // Normalize invalid credentials message to Hebrew
      const isInvalidCredentials =
        status === 401 && /invalid|credentials|email|password/i.test(m);

      // Account locked after failed attempts (BE uses 403)
      if (status === 403 && m.toLowerCase().includes("account locked")) {
        const match = m.match(/try again in\s+([0-9]{1,2}:[0-9]{2})/i);
        const untilText = match?.[1] ? match[1] : "";

        setLockInfo({
          isLocked: true,
          untilText,
        });
        return;
      }

      // Daily request limit reached
      if (status === 429) {
        return;
      }

      showToast(
        isInvalidCredentials
          ? "אימייל או סיסמה שגויים"
          : String(m || "התחברות נכשלה. בדוק אימייל וסיסמה ונסה שוב."),
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          התחברות
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          התחבר לחשבון שלך כדי להמשיך
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">אימייל</label>
            <input
              type="email"
              dir="ltr"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => touch("email")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              placeholder="name@example.com"
            />
            <FieldError msg={touched.email ? errors.email : ""} />
          </div>

          <div>
            <label className="text-sm font-semibold">סיסמה</label>
            <input
              type="password"
              dir="ltr"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => touch("password")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              placeholder="••••••••"
            />
            <FieldError msg={touched.password ? errors.password : ""} />
          </div>

          <button
            disabled={!canSubmit}
            className={[
              "w-full rounded-xl px-4 py-3 text-sm font-bold",
              canSubmit
                ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"
                : "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
            ].join(" ")}
          >
            {isSubmitting ? "מתחבר..." : "התחבר"}
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          שכחת סיסמה?{" "}
          <a href="/forgot-password" className="font-bold underline">
            לחץ כאן{" "}
          </a>
        </div>
      </form>
      {lockInfo.isLocked && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          <div className="font-bold">החשבון נחסם זמנית</div>
          <div className="mt-1">
            נחסמת לאחר 3 ניסיונות התחברות שגויים.
            {lockInfo.untilText
              ? ` ניתן לנסות שוב בעוד ${lockInfo.untilText}.`
              : " נסה שוב מחר."}
          </div>
        </div>
      )}
    </div>
  );
}
