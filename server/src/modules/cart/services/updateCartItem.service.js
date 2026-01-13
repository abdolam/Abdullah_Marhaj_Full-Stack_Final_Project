import Product from "../../product/models/product.model.js";

import { getOrCreateCart } from "./getOrCreateCart.service.js";
import { recalculateCart } from "./recalculateCart.service.js";

export const updateCartItem = async (userId, productId, quantity) => {
  try {
    const cart = await getOrCreateCart(userId);

    const idx = cart.items.findIndex(
      (it) => String(it.product) === String(productId)
    );

    if (idx === -1) {
      throw Object.assign(new Error("Item not found in cart"), { status: 404 });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty)) {
      throw Object.assign(new Error("Quantity must be a number"), {
        status: 400,
      });
    }

    // qty <= 0 means remove item
    if (qty <= 0) {
      cart.items.splice(idx, 1);
      return await recalculateCart(cart);
    }

    // validate product still exists and active
    const product = await Product.findById(productId).lean().exec();
    if (!product || product.isActive === false) {
      throw Object.assign(new Error("Product not found"), { status: 404 });
    }

    cart.items[idx].quantity = Math.floor(qty);

    return await recalculateCart(cart);
  } catch (error) {
    console.error("Failed to update cart item", error);
    throw error;
  }
};
