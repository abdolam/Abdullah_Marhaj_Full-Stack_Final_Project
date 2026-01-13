import { Leaf, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
          {icon}
        </div>
        <div>
          <div className="text-base font-bold text-brand-navy dark:text-brand-gold">
            {title}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ title, text }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800">
      <div className="text-sm font-bold text-brand-navy dark:text-brand-gold">
        {title}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{text}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          אודות EcoStore
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          EcoStore היא חנות אונליין המתמקדת במוצרים איכותיים עם מידע ברור, מלאי
          מעודכן וחוויית קנייה נוחה.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={
            <Leaf className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="בחירה חכמה"
          text="אנחנו בוחרים מוצרים בקפידה ומציגים מפרט ברור כדי שתוכל לקבל החלטה מהר ובביטחון."
        />
        <InfoCard
          icon={
            <ShieldCheck className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="אמינות ושקיפות"
          text="מחירים ברורים, מצב מלאי מובן, ותהליכים עקביים בעגלה ובתשלום כדי למנוע הפתעות."
        />
        <InfoCard
          icon={
            <Truck className="h-5 w-5 text-brand-navy dark:text-brand-gold" />
          }
          title="שירות ונוחות"
          text="תהליך קנייה פשוט, תמיכה זמינה, ואפשרויות משלוח והחזרה נוחות (בהתאם למדיניות החנות)."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store story */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
            הסיפור שלנו
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            EcoStore נולדה מתוך רצון לבנות חנות שמכבדת את הלקוח: לא להסתיר מידע,
            לא לבלבל, ולא להציג מלאי לא אמין. המטרה שלנו היא חוויה נקייה וברורה,
            שמאפשרת לקנות מהר ולהרגיש בטוח.
          </p>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            אנחנו מאמינים שממשק פשוט ושקוף הוא חלק מהאיכות. לכן אנחנו שמים דגש
            על תיאור קצר, מפרט טכני כשיש, ומדיניות ברורה.
          </p>
        </div>

        {/* FAQ-like */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
            שאלות נפוצות
          </div>

          <div className="mt-3">
            <Row
              title="משלוחים"
              text="זמני המשלוח והעלויות מוצגים בשלב התשלום. ייתכנו הבדלים לפי אזור."
            />
            <Row
              title="החזרות והחלפות"
              text="ניתן להחזיר מוצרים בהתאם למדיניות החנות ובתנאי שהמוצר תקין ולא נעשה בו שימוש."
            />
            <Row
              title="תמיכה"
              text="לשאלות ותמיכה ניתן לפנות דרך עמוד יצירת קשר. נחזור אליך בהקדם."
            />
            <Row
              title="מלאי"
              text="אנחנו משתדלים לשמור מלאי מעודכן. אם מוצר אזל, ניתן לראות זאת בעמוד המוצר ובעמוד המוצרים."
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        <div className="font-bold text-brand-navy dark:text-brand-gold">
          רוצים להתחיל?
        </div>
        <div className="flex gap-2 mt-2">
          <div> עברו לעמוד המוצרים, חפשו לפי שם, ובחרו את מה שמתאים לכם.</div>
          <Link to="/products" className="text-brand-navy font-bold">
            למוצרים
          </Link>
        </div>
      </div>
    </div>
  );
}
