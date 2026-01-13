import Order from "../models/order.model.js";

export const getMyOrders = async (userId) => {
  try {
    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });
    return orders;
  } catch (error) {
    console.error("Failed to get user orders", error);
    throw error;
  }
};
