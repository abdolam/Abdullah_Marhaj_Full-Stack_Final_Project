import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          פאנל ניהול
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/products"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">מוצרים</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            CRUD בסיסי
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">קטגוריות</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            CRUD בסיסי
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">הזמנות</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            צפייה ועדכון סטטוס
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="font-bold">משתמשים</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            צפייה בלבד
          </div>
        </Link>
      </div>
    </div>
  );
}
