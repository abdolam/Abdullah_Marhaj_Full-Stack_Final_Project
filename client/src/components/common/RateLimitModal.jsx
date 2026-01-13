import Modal from "../Modal";

export default function RateLimitModal({ isOpen, onClose, message }) {
  return (
    <Modal
      title="מגבלת בקשות"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="מגבלת בקשות"
    >
      <div className="w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
          הגעת למגבלת הבקשות להיום
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {message ||
            "חרגת ממספר הבקשות היומי. לא ניתן לבצע פעולות נוספות. נסה שוב מחר."}
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
          >
            הבנתי
          </button>
        </div>
      </div>
    </Modal>
  );
}
