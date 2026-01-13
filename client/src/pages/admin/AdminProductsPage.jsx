import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../api/productsApi";
import ConfirmActionModal from "../../components/common/ConfirmActionModal";
import Modal from "../../components/Modal";
import useToast from "../../hooks/useToast";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  isActive: true,
};

function normalizeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [state, setState] = useState({
    status: "loading",
    products: [],
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [confirm, setConfirm] = useState({
    isOpen: false,
    product: null,
  });

  function load() {
    setState((p) => ({ ...p, status: "loading" }));
    getAllProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products || [];
        setState({
          status: "ready",
          products: Array.isArray(list) ? list : [],
        });
      })
      .catch(() => {
        setState({ status: "error", products: [] });
        showToast("שגיאה בטעינת מוצרים", "error");
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = state.products || [];

  const title = useMemo(() => {
    return editing ? "עריכת מוצר" : "יצירת מוצר";
  }, [editing]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p?.name || "",
      description: p?.description || "",
      price: String(p?.price ?? ""),
      image: p?.image || "",
      category: p?.category || "",
      isActive: p?.isActive ?? true,
    });
    setFormOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: normalizeNumber(form.price),
      image: form.image.trim(),
      category: form.category.trim(),
      isActive: !!form.isActive,
      images: [],
    };

    if (
      !payload.name ||
      !payload.description ||
      !payload.image ||
      !payload.category
    ) {
      showToast("נא למלא את כל השדות החובה", "error");
      return;
    }

    try {
      if (editing?._id) {
        await updateProduct(editing._id, payload);
        showToast("המוצר עודכן", "success");
      } else {
        await createProduct(payload);
        showToast("המוצר נוצר", "success");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה בשמירת מוצר";
      showToast(String(msg), "error");
    }
  }

  async function onDeleteConfirmed() {
    const p = confirm.product;
    setConfirm({ isOpen: false, product: null });

    if (!p?._id) return;

    try {
      await deleteProduct(p._id);
      showToast("המוצר נמחק", "success");
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה במחיקת מוצר";
      showToast(String(msg), "error");
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to={"/admin"}
        className=" text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowRight />
      </Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">
            ניהול מוצרים
          </h1>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            סך הכל: {products.length}
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
        >
          מוצר חדש
        </button>
      </div>

      {state.status === "loading" && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          טוען מוצרים...
        </div>
      )}

      {state.status !== "loading" && products.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          אין מוצרים.
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-center bg-white text-sm dark:bg-slate-950">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="p-3">שם</th>
                <th className="p-3">קטגוריה</th>
                <th className="p-3">מחיר</th>
                <th className="p-3">פעיל</th>
                <th className="p-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.price}</td>
                  <td className="p-3">{p.isActive ? "כן" : "לא"}</td>
                  <td className="p-3">
                    <div className="flex  justify-center flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="rounded-lg border border-slate-300 px-3 py-1 font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                      >
                        עריכה
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ isOpen: true, product: p })}
                        className="rounded-lg border border-rose-300 px-3 py-1 font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-900"
                      >
                        מחיקה
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <Modal
          title={title}
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
        >
          <form onSubmit={onSubmit} className="space-y-3 text-white">
            <div>
              <label className="text-sm font-semibold">שם מוצר</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">תיאור</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
                rows={4}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">מחיר</label>
                <input
                  type="number"
                  dir="ltr"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">קטגוריה</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              <div>
                <label className="text-sm font-semibold">
                  תמונה ראשית (URL)
                </label>
                <input
                  dir="ltr"
                  value={form.image}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, image: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-900"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.isActive}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.checked }))
                }
              />
              פעיל
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
              >
                שמירה
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                ביטול
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmActionModal
        isOpen={confirm.isOpen}
        type="delete"
        productName={confirm.product?.name || "מוצר"}
        onConfirm={onDeleteConfirmed}
        onCancel={() => setConfirm({ isOpen: false, product: null })}
      />
    </div>
  );
}
