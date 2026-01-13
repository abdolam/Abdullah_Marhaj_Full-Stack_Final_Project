import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { createOrder } from "../api/ordersApi";
import ConfirmActionModal from "../components/common/ConfirmActionModal";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useConfirmAction from "../hooks/useConfirmAction";
import useToast from "../hooks/useToast";
import { toAbsoluteUrl } from "../utils/mediaUrl";

function CartItemRow({
  idx,
  busy,
  qty,
  productId,
  name,
  unitPrice,
  lineTotal,
  imgSrc,
  onOpenImage,
  onConfirmRemove,
  onInc,
  onDec,
  onBlurCommit,
}) {
  return (
    <div
      key={`${String(productId)}_${idx}`}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex gap-4">
        <button
          type="button"
          className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          onClick={() => {
            if (!imgSrc) return;
            onOpenImage(imgSrc, name);
          }}
          aria-label="הצג תמונה"
          title="הצג תמונה"
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
              אין תמונה
            </div>
          )}
        </button>

        <div className="flex-1">
          <Link
            to={`/products/${String(productId)}`}
            className="text-lg font-bold text-brand-navy hover:underline dark:text-brand-gold"
          >
            {name}
          </Link>

          <div
            className="mt-1 text-sm text-slate-600 dark:text-slate-300"
            dir="ltr"
          >
            מחיר ליחידה: ₪{Number(unitPrice || 0).toFixed(2)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy || qty <= 1}
              onClick={() => onDec(String(productId), qty)}
              className={[
                "h-10 w-10 rounded-xl border border-slate-300 font-bold",
                busy || qty <= 1
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-slate-100 dark:hover:bg-slate-900",
                "dark:border-slate-700",
              ].join(" ")}
              aria-label="הפחת כמות"
              title="הפחת כמות"
            >
              -
            </button>

            <input
              type="number"
              min={1}
              value={qty}
              disabled={busy}
              onChange={(e) => {
                const v = e.target.value;
                // keep as string-like behavior, but store numeric
                const next = Math.max(1, Math.floor(Number(v) || 1));
                onBlurCommit(String(productId), next, qty);
              }}
              className="text-center h-10 w-20 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              dir="ltr"
            />

            <button
              type="button"
              disabled={busy}
              onClick={() => onInc(String(productId), qty)}
              className={[
                "h-10 w-10 rounded-xl border border-slate-300 font-bold",
                busy
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-slate-100 dark:hover:bg-slate-900",
                "dark:border-slate-700",
              ].join(" ")}
              aria-label="הוסף כמות"
              title="הוסף כמות"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <button
            type="button"
            disabled={busy}
            onClick={() => onConfirmRemove(String(productId), name)}
            className={[
              "h-10 w-10 rounded-xl border border-slate-300 p-2",
              busy
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-slate-100 dark:hover:bg-slate-900",
              "dark:border-slate-700",
            ].join(" ")}
            aria-label="הסר פריט"
            title="הסר פריט"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div
            className="text-sm font-bold text-slate-700 dark:text-slate-200"
            dir="ltr"
          >
            {` סה"כ: ₪`}
            {Number(lineTotal || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cart = useCart({
    isLoggedIn,
    onAuthRequired: () => {
      showToast("כדי לצפות בעגלה צריך להתחבר", "error");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    },
    showToast,
  });

  const confirm = useConfirmAction();

  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imgModalSrc, setImgModalSrc] = useState("");
  const [imgModalAlt, setImgModalAlt] = useState("");

  const isEmpty = useMemo(() => cart.items.length === 0, [cart.items]);

  function markUserCartAction(productId) {
    window.dispatchEvent(
      new CustomEvent("ecostore_user_cart_action", {
        detail: { productId: String(productId) },
      })
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          העגלה שלך
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          כדי לצפות בעגלה צריך להתחבר.
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

  if (cart.status === "loading") {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
          טוען עגלה...
        </h1>
      </div>
    );
  }

  async function handlePlaceOrder() {
    if (isEmpty) {
      showToast("העגלה ריקה", "error");
      return;
    }

    if (isPlacingOrder) return;

    setIsPlacingOrder(true);

    try {
      const order = await createOrder({ paymentMethod: "card", notes: "" });

      const orderNo =
        order?.orderNumber ||
        order?.order?.orderNumber ||
        order?.data?.orderNumber;

      showToast(
        orderNo
          ? `ההזמנה נוצרה בהצלחה (מס' ${orderNo})`
          : "ההזמנה נוצרה בהצלחה",
        "success"
      );

      cart.clear();

      navigate("/orders", {
        state: orderNo ? { highlightOrderNumber: orderNo } : undefined,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה ביצירת הזמנה";
      showToast(String(msg), "error");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  const subtotal = Number(cart?.totals?.subtotal ?? cart?.totals?.total ?? 0);
  const total = Number(cart?.totals?.total ?? 0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
            העגלה שלך
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            נהל את המוצרים בעגלה והמשך לתשלום.
          </p>
        </div>

        <button
          type="button"
          disabled={isEmpty || cart.status === "loading"}
          onClick={() => confirm.confirmClear()}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-bold",
            isEmpty
              ? "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500"
              : "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950",
          ].join(" ")}
        >
          ניקוי עגלה
        </button>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          העגלה ריקה.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.items.map((item, idx) => {
              const product = item?.product;
              const productId =
                product?._id || item?.productId || item?.product;
              const name = product?.name || item?.name || "מוצר";
              const qty = Math.max(1, Number(item?.quantity || 1));
              const busy = Boolean(cart.busyMap?.[String(productId)]);

              const unitPrice = Number(item?.price ?? product?.price ?? 0);
              const lineTotal = Number(
                item?.total ?? Number((unitPrice * qty).toFixed(2))
              );

              const imgSrc = toAbsoluteUrl(product?.image);

              return (
                <CartItemRow
                  key={`${String(productId)}_${idx}`}
                  item={item}
                  idx={idx}
                  busy={busy}
                  qty={qty}
                  productId={productId}
                  name={name}
                  unitPrice={unitPrice}
                  lineTotal={lineTotal}
                  imgSrc={imgSrc}
                  onOpenImage={(src, alt) => {
                    setImgModalSrc(src);
                    setImgModalAlt(alt);
                    setImgModalOpen(true);
                  }}
                  onConfirmRemove={(pid, pname) =>
                    confirm.confirmRemove(pid, pname)
                  }
                  onInc={(pid, currentQty) => {
                    markUserCartAction(pid);
                    return cart.inc(String(pid), currentQty);
                  }}
                  onDec={(pid, currentQty) => {
                    markUserCartAction(pid);
                    return cart.dec(String(pid), currentQty);
                  }}
                  onBlurCommit={(pid, nextQty, currentQty) => {
                    markUserCartAction(pid);
                    return cart.setQtyFromInput(
                      String(pid),
                      nextQty,
                      currentQty
                    );
                  }}
                />
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-lg font-bold text-brand-navy dark:text-brand-gold">
              סיכום
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  סכום ביניים
                </span>
                <span className="font-semibold" dir="ltr">
                  ₪{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-200">
                  לתשלום
                </span>
                <span
                  className="text-base font-extrabold text-brand-navy dark:text-brand-gold"
                  dir="ltr"
                >
                  ₪{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isEmpty || isPlacingOrder}
              className="mt-5 w-full rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPlacingOrder ? "יוצר הזמנה..." : "ביצוע הזמנה"}
            </button>

            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              בשלב זה הפעולה מדגימה יצירת הזמנה במערכת, ללא חיוב אמיתי.
            </div>
          </div>
        </div>
      )}

      <Modal
        title="תמונה"
        isOpen={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        ariaLabel="תצוגת תמונה"
      >
        <img
          src={imgModalSrc}
          alt={imgModalAlt}
          className="w-full rounded-xl object-contain"
        />
      </Modal>

      <ConfirmActionModal
        isOpen={confirm.confirm.isOpen}
        type={confirm.confirm.type}
        productName={confirm.confirm.productName}
        onConfirm={() =>
          confirm.handleConfirm({
            onClear: cart.clear,
            onRemove: cart.remove,
          })
        }
        onCancel={confirm.closeConfirm}
      />
    </div>
  );
}
