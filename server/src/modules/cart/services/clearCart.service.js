import { getOrCreateCart } from "./getOrCreateCart.service.js";

export const clearCart = async (userId) => {
  try {
    const cart = await getOrCreateCart(userId);

    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;

    await cart.save();
    await cart.populate("items.product");

    return cart;
  } catch (error) {
    console.error("Failed to clear cart", error);
    throw error;
  }
};
