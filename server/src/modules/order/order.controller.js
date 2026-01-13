import { createOrderFromCart } from "./services/createOrderFromCart.service.js";
import { getAllOrders } from "./services/getAllOrders.service.js";
import { getMyOrders } from "./services/getMyOrders.service.js";
import { getOrderById } from "./services/getOrderById.service.js";
import { updateOrderItems } from "./services/updateOrderItems.service.js";
import { updateOrderStatus } from "./services/updateOrderStatus.service.js";

const getUserIdFromRequest = (req) => req.user?.id || req.user?._id;
const isAdminFromRequest = (req) => req.user?.role === "admin";

// POST /orders
export const createOrderController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { paymentMethod, notes } = req.body || {};

  const order = await createOrderFromCart(userId, { paymentMethod, notes });

  res.status(201).json({
    message: "Order created successfully",
    order,
  });
};

// GET /orders/mine
export const getMyOrdersController = async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const orders = await getMyOrders(userId);

  res.status(200).json(orders);
};

// GET /orders/:id
export const getOrderController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const isAdmin = isAdminFromRequest(req);
  const { id: orderId } = req.params;

  const order = await getOrderById(userId, orderId, isAdmin);

  res.status(200).json(order);
};

// GET /orders  (admin)
export const getAllOrdersController = async (_req, res) => {
  const orders = await getAllOrders();
  res.status(200).json(orders);
};

// PATCH /orders/:id/status  (admin)
export const updateOrderStatusController = async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  const order = await updateOrderStatus(orderId, status);

  res.status(200).json({
    message: "Order status updated",
    order,
  });
};

// PATCH /orders/:id/items  (admin, pending only)
export const updateOrderItemsController = async (req, res) => {
  const { id: orderId } = req.params;
  const { items } = req.body;

  const order = await updateOrderItems(orderId, items);

  res.status(200).json({
    message: "Order items updated",
    order,
  });
};
