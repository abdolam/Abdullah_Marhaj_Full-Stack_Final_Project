import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function AccountPage() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          אזור אישי
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          כדי לצפות באזור האישי צריך להתחבר.
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
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          אזור אישי
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/orders"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">ההזמנות שלי</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            צפייה בהיסטוריית הזמנות
          </div>
        </Link>

        <Link
          to="/profile"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">הפרופיל שלי</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            פרטים בסיסיים (קריאה בלבד)
          </div>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-right shadow-sm hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:hover:bg-rose-900"
        >
          <div className="font-bold text-rose-800 dark:text-rose-200">
            התנתקות
          </div>
          <div className="mt-1 text-sm text-rose-700 dark:text-rose-300">
            יציאה מהחשבון
          </div>
        </button>
      </div>
    </div>
  );
}
