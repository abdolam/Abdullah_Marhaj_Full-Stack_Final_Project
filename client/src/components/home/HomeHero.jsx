import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <section className="relative flex justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://aios.horisontgruppen.dk/images/w2048/9ef8740a-7693-400e-bc34-869e1e03874c.jpg)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-slate-950/55 dark:bg-slate-950/65"
        aria-hidden="true"
      />

      <div className="relative text-center px-6 py-14 sm:px-10 sm:py-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            EcoStore
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-100 sm:text-base">
            חנות אונליין חכמה עם מוצרים איכותיים, מלאי ברור וחוויית קנייה נוחה.
          </p>

          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-brand-navy hover:opacity-90"
            >
              למוצרים
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
