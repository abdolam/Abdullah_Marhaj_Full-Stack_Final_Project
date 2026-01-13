import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto text-center grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
            EcoStore
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            חנות אונליין למוצרים אקולוגיים ואיכותיים.
          </p>
        </div>

        <div>
          <div className="font-semibold">קישורים</div>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link className="hover:underline" to="/about">
              אודות
            </Link>
            <Link className="hover:underline" to="/contact">
              יצירת קשר
            </Link>
          </div>
        </div>

        <div>
          <div className="font-semibold">פרטי קשר</div>
          <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <div>אימייל: support@ecostore.io</div>
            <div>טלפון: 054-1234567</div>
            <div>שעות פעילות: א׳–ה׳ 09:00–17:00</div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © EcoStore. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
