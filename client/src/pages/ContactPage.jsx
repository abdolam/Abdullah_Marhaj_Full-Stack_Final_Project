import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useMemo, useState } from "react";

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">{msg}</p>;
}

export default function ContactPage() {
  // TODO (later): you can move these to a config file if you want.
  const STORE_NAME = "EcoStore";
  const PHONE = "03-1234567";
  const EMAIL = "support@ecostore.io";

  // Pick a real address you want to show (this is a placeholder).
  const ADDRESS_TEXT = "הרצל 1, תל אביב";
  const MAP_QUERY = encodeURIComponent(ADDRESS_TEXT);

  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState({});

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function touch(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  const errors = useMemo(() => {
    const e = {};

    if (!values.name.trim()) e.name = "יש להזין שם";
    if (!values.email.trim()) e.email = "יש להזין אימייל";
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
      e.email = "אימייל לא תקין";

    if (!values.message.trim()) e.message = "יש להזין הודעה";
    else if (values.message.trim().length < 10)
      e.message = "ההודעה קצרה מדי (לפחות 10 תווים)";

    return e;
  }, [values]);

  const canSend = Object.keys(errors).length === 0;

  function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!canSend) return;

    const subject = encodeURIComponent(`פנייה חדשה - ${STORE_NAME}`);
    const body = encodeURIComponent(
      `שם: ${values.name}\nאימייל: ${values.email}\n\nהודעה:\n${values.message}\n`
    );

    // Works immediately without backend:
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          יצירת קשר
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          נשמח לעזור. ניתן ליצור קשר דרך הטלפון, אימייל, או להשאיר הודעה בטופס.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
            שלח הודעה
          </div>

          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-semibold">שם</label>
              <input
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => touch("name")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              />
              <FieldError msg={touched.name ? errors.name : ""} />
            </div>

            <div>
              <label className="text-sm font-semibold">אימייל</label>
              <input
                type="email"
                dir="ltr"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => touch("email")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              />
              <FieldError msg={touched.email ? errors.email : ""} />
            </div>

            <div>
              <label className="text-sm font-semibold">הודעה</label>
              <textarea
                value={values.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => touch("message")}
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              />
              <FieldError msg={touched.message ? errors.message : ""} />
            </div>

            <button
              type="submit"
              disabled={!canSend}
              className={[
                "w-full rounded-xl px-4 py-3 text-sm font-bold",
                canSend
                  ? "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"
                  : "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
              ].join(" ")}
            >
              שלח
            </button>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              כרגע ההודעה נשלחת דרך תוכנת האימייל (mailto). בשלב מתקדם נוסיף
              שליחה לשרת + ניהול פניות.
            </div>
          </form>
        </div>

        {/* Details + Map */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
              פרטי התקשרות
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <Phone className="h-4 w-4" />
                <span dir="ltr">{PHONE}</span>
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <Mail className="h-4 w-4" />
                <span dir="ltr">{EMAIL}</span>
              </a>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
                <MapPin className="h-4 w-4" />
                <span>{ADDRESS_TEXT}</span>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3 text-sm font-bold text-brand-navy hover:opacity-90"
              >
                <Navigation className="h-4 w-4" />
                נווט
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <iframe
              title="מפה"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
