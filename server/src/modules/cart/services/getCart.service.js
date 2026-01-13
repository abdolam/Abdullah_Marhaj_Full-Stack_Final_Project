import { getOrCreateCart } from "./getOrCreateCart.service.js";
import { recalculateCart } from "./recalculateCart.service.js";

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return recalculateCart(cart);
};
