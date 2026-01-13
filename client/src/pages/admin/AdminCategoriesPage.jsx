import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../api/categoriesApi";
import ConfirmActionModal from "../../components/common/ConfirmActionModal";
import Modal from "../../components/Modal";
import useToast from "../../hooks/useToast";

const emptyForm = {
  name: "",
  description: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const { showToast } = useToast();

  const [state, setState] = useState({
    status: "loading",
    categories: [],
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [confirm, setConfirm] = useState({
    isOpen: false,
    category: null,
  });

  function load() {
    setState((p) => ({ ...p, status: "loading" }));
    getAllCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.categories || [];
        setState({
          status: "ready",
          categories: Array.isArray(list) ? list : [],
        });
      })
      .catch(() => {
        setState({ status: "error", categories: [] });
        showToast("שגיאה בטעינת קטגוריות", "error");
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = state.categories || [];

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      name: c?.name || "",
      description: c?.description || "",
      isActive: c?.isActive ?? true,
    });
    setFormOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      isActive: !!form.isActive,
    };

    if (!payload.name) {
      showToast("שם קטגוריה חובה", "error");
      return;
    }

    try {
      if (editing?._id) {
        await updateCategory(editing._id, payload);
        showToast("הקטגוריה עודכנה", "success");
      } else {
        await createCategory(payload);
        showToast("הקטגוריה נוצרה", "success");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה בשמירת קטגוריה";
      showToast(String(msg), "error");
    }
  }

  async function onDeleteConfirmed() {
    const c = confirm.category;
    setConfirm({ isOpen: false, category: null });

    if (!c?._id) return;

    try {
      await deleteCategory(c._id);
      showToast("הקטגוריה נמחקה", "success");
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "שגיאה במחיקת קטגוריה";
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
            ניהול קטגוריות
          </h1>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            סך הכל: {categories.length}
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-gold hover:text-brand-navy"
        >
          קטגוריה חדשה
        </button>
      </div>

      {state.status === "loading" && (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          טוען קטגוריות...
        </div>
      )}

      {state.status !== "loading" && categories.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          אין קטגוריות.
        </div>
      )}

      {categories.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full bg-white text-sm dark:bg-slate-950">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr className="text-right">
                <th className="p-3">שם</th>
                <th className="p-3">תיאור</th>
                <th className="p-3">פעיל</th>
                <th className="p-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {c.description || "-"}
                  </td>
                  <td className="p-3">{c.isActive ? "כן" : "לא"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="rounded-lg border border-slate-300 px-3 py-1 font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                      >
                        עריכה
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({ isOpen: true, category: c })
                        }
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
          title={editing ? "עריכת קטגוריה" : "יצירת קטגוריה"}
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-semibold">שם</label>
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
        productName={confirm.category?.name || "קטגוריה"}
        onConfirm={onDeleteConfirmed}
        onCancel={() => setConfirm({ isOpen: false, category: null })}
      />
    </div>
  );
}
