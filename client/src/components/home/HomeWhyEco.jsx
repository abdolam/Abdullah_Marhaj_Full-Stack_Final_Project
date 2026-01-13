import { Leaf, ShieldCheck, Truck } from "lucide-react";

function Item({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-brand-navy dark:text-brand-gold">
            {title}
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeWhyEco() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-brand-navy dark:text-brand-gold">
          למה EcoStore
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          חוויה ברורה, שירות נוח, ומוצרים שנבחרים בקפידה.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Item
          icon={
            <Leaf className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="בחירה חכמה"
          text="מוצרים איכותיים עם מידע ברור, כדי להחליט מהר ובביטחון."
        />
        <Item
          icon={
            <ShieldCheck className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="אמינות"
          text="התנהגות עקבית מול מלאי, עגלה והתחברות, כדי למנוע הפתעות."
        />
        <Item
          icon={
            <Truck className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="נוחות"
          text="ממשק נקי ומהיר שמכוון לפעולה: לחפש, לבחור, ולהוסיף לעגלה."
        />
      </div>
    </section>
  );
}
