import { getOrCreateCart } from "./getOrCreateCart.service.js";
import { recalculateCart } from "./recalculateCart.service.js";

export const removeCartItem = async (userId, productId) => {
  try {
    const cart = await getOrCreateCart(userId);

    cart.items = (cart.items || []).filter(
      (it) => String(it.product) !== String(productId)
    );

    return await recalculateCart(cart);
  } catch (error) {
    console.error("Failed to remove cart item", error);
    throw error;
  }
};
