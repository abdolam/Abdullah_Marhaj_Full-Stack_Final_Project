import Modal from "../Modal";

export default function ConfirmActionModal({
  isOpen,
  type,
  productName,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      title="אישור פעולה"
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabel="אישור פעולה"
    >
      <div className="w-[92vw] max-w-md rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
          {type === "clear" ? "ניקוי עגלה" : "הסרת פריט"}
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {type === "clear"
            ? "האם אתה בטוח שברצונך לנקות את כל העגלה?"
            : `האם אתה בטוח שברצונך להסיר את '${productName}' מהעגלה?`}
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            כן, המשך
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            ביטול
          </button>
        </div>
      </div>
    </Modal>
  );
}
