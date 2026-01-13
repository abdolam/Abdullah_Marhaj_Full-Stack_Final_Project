import { getCart } from "./getCart.service.js";

export const getCartSummary = async (userId) => {
  const cart = await getCart(userId);

  return {
    items: cart.items,
    subtotal: cart.subtotal,
    total: cart.total,
  };
};
