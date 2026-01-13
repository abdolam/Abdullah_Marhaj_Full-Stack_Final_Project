import Order from "../models/order.model.js";

export const updateOrderStatus = async (orderId, nextStatus) => {
  const order = await Order.findById(orderId).exec();
  if (!order) {
    throw Object.assign(new Error("Order not found"), { status: 404 });
  }

  const allowed = ["pending", "paid", "shipped", "completed", "cancelled"];
  if (!allowed.includes(nextStatus)) {
    throw Object.assign(new Error("Invalid order status"), { status: 400 });
  }

  order.status = nextStatus;
  await order.save();

  return order;
};
