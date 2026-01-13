import Order from "../models/order.model.js";

export const getOrderById = async (userId, orderId, isAdmin = false) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw Object.assign(new Error("Order not found"), { status: 404 });
    }

    if (!isAdmin && order.user.toString() !== userId.toString()) {
      throw Object.assign(new Error("Not allowed to view this order"), {
        status: 403,
      });
    }

    return order;
  } catch (error) {
    console.error("Failed to get order by id", error);
    throw error;
  }
};
