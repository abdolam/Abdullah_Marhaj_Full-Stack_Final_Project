import Order from "../models/order.model.js";

export const getAllOrders = async () => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user");
    return orders;
  } catch (error) {
    console.error("Failed to get all orders", error);
    throw error;
  }
};
