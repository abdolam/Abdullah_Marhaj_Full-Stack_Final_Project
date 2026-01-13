import Product from "../../product/models/product.model.js";

import { getOrCreateCart } from "./getOrCreateCart.service.js";
import { recalculateCart } from "./recalculateCart.service.js";

export const addToCart = async (userId, productId, quantity) => {
  try {
    const product = await Product.findById(productId).lean().exec();
    if (!product || product.isActive === false) {
      throw Object.assign(new Error("Product not found"), { status: 404 });
    }

    const qty = Number(quantity || 0);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw Object.assign(new Error("Quantity must be at least 1"), {
        status: 400,
      });
    }

    const cart = await getOrCreateCart(userId);

    const existing = cart.items.find(
      (it) => String(it.product) === String(product._id)
    );

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + qty;
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: Number(product.price || 0),
        total: 0,
      });
    }

    return await recalculateCart(cart);
  } catch (error) {
    console.error("Failed to add to cart", error);
    throw error;
  }
};
