import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/usersApi";
import useToast from "../hooks/useToast";
import { extractErrorMessage } from "../utils/httpError";
import { validateRegister } from "../utils/userValidation";

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">{msg}</p>;
}

function mapRegisterError(msg) {
  const m = String(msg || "").toLowerCase();
  if (m.includes("email") && m.includes("already"))
    return "האימייל כבר קיים במערכת";
  return String(msg);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [values, setValues] = useState({
    first: "",
    last: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validateRegister(values), [values]);
  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function touch(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    setTouched({
      first: true,
      last: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
      city: true,
      street: true,
      houseNumber: true,
      zip: true,
    });

    const finalErrors = validateRegister(values);
    if (Object.keys(finalErrors).length > 0) {
      showToast("יש לתקן את השדות המסומנים", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: {
          first: values.first.trim(),
          last: values.last.trim(),
        },
        phone: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        address: {
          city: values.city.trim(),
          street: values.street.trim(),
          houseNumber: Number(values.houseNumber),
          zip: Number(values.zip),
        },
      };

      await registerUser(payload);

      showToast("נרשמת בהצלחה 🎉", "success");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        showToast("האימייל כבר קיים במערכת", "error");
        return;
      }

      const serverMsg = extractErrorMessage(err);
      if (serverMsg) {
        showToast(mapRegisterError(serverMsg), "error");
      } else {
        showToast("הרשמה נכשלה. בדוק נתונים ונסה שוב.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          הרשמה
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          מלא את הפרטים שלך
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">שם פרטי</label>
            <input
              type="text"
              value={values.first}
              onChange={(e) => setField("first", e.target.value)}
              onBlur={() => touch("first")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.first ? errors.first : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">שם משפחה</label>
            <input
              type="text"
              value={values.last}
              onChange={(e) => setField("last", e.target.value)}
              onBlur={() => touch("last")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.last ? errors.last : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">טלפון</label>
            <input
              type="text"
              value={values.phone}
              dir="ltr"
              onChange={(e) => setField("phone", e.target.value)}
              onBlur={() => touch("phone")}
              placeholder="054-1234567"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.phone ? errors.phone : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">אימייל</label>
            <input
              type="email"
              placeholder="name@example.com"
              dir="ltr"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => touch("email")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.email ? errors.email : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">סיסמה</label>
            <input
              type="password"
              placeholder="••••••••"
              dir="ltr"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => touch("password")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.password ? errors.password : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">אימות סיסמה</label>
            <input
              type="password"
              placeholder="••••••••"
              dir="ltr"
              value={values.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              onBlur={() => touch("confirmPassword")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError
              msg={touched.confirmPassword ? errors.confirmPassword : ""}
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm font-semibold">רחוב</label>
            <input
              type="text"
              value={values.street}
              onChange={(e) => setField("street", e.target.value)}
              onBlur={() => touch("street")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.street ? errors.street : ""} />
          </div>

          <div>
            <label className="text-sm font-semibold">מספר בית</label>
            <input
              type="number"
              value={values.houseNumber}
              onChange={(e) => setField("houseNumber", e.target.value)}
              onBlur={() => touch("houseNumber")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.houseNumber ? errors.houseNumber : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">עיר</label>
            <input
              type="text"
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              onBlur={() => touch("city")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.city ? errors.city : ""} />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">מיקוד</label>
            <input
              type="number"
              value={values.zip}
              onChange={(e) => setField("zip", e.target.value)}
              onBlur={() => touch("zip")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
            />
            <FieldError msg={touched.zip ? errors.zip : ""} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "flex-1 rounded-xl px-4 py-3 text-sm font-bold",
              canSubmit
                ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"
                : "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
            ].join(" ")}
          >
            {isSubmitting ? "שולח..." : "צור חשבון"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}
