import { useState } from "react";

export default function useConfirmAction() {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    type: "", // "clear" | "remove"
    productId: null,
    productName: "",
  });

  function confirmClear() {
    setConfirm({
      isOpen: true,
      type: "clear",
      productId: null,
      productName: "",
    });
  }

  function confirmRemove(productId, productName) {
    setConfirm({
      isOpen: true,
      type: "remove",
      productId,
      productName: String(productName || "מוצר"),
    });
  }

  function closeConfirm() {
    setConfirm({
      isOpen: false,
      type: "",
      productId: null,
      productName: "",
    });
  }

  async function handleConfirm(actions) {
    const { type, productId } = confirm;
    closeConfirm();

    if (type === "clear" && actions.onClear) {
      await actions.onClear();
    }

    if (type === "remove" && productId && actions.onRemove) {
      await actions.onRemove(productId);
    }
  }

  return {
    confirm,
    confirmClear,
    confirmRemove,
    closeConfirm,
    handleConfirm,
  };
}
