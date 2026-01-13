export default function Modal({ title, isOpen, onClose, children, ariaLabel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || "חלון קופץ"}
      onClick={onClose}
    >
      <div
        className={[
          "relative flex max-h-[92vh] max-w-[92vw] items-center justify-center",
          // Make common media fit without scrolling
          "[&_img]:max-h-[92vh] [&_img]:max-w-[92vw] [&_img]:object-contain",
          "[&_video]:max-h-[92vh] [&_video]:max-w-[92vw] [&_video]:object-contain",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-8   -right-8 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-slate-900 shadow hover:bg-white dark:bg-slate-950/90 dark:text-slate-100"
          aria-label="סגירה"
          title="סגירה"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
