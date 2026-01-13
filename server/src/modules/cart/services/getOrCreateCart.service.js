import Cart from "../models/cart.model.js";

export const getOrCreateCart = async (userId) => {
  const existing = await Cart.findOne({ user: userId }).exec();
  if (existing) return existing;

  return Cart.create({
    user: userId,
    items: [],
    subtotal: 0,
    total: 0,
  });
};
