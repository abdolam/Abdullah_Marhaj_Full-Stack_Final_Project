import express from "express";

import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/roles.js";
import { validateBody } from "../../middlewares/validate.js";

import {
  createOrderController,
  getMyOrdersController,
  getOrderController,
  getAllOrdersController,
  updateOrderStatusController,
  updateOrderItemsController,
} from "./order.controller.js";
import {
  createOrderSchema,
  updateOrderItemsSchema,
  updateOrderStatusSchema,
} from "./validation/order.validation.js";

const router = express.Router();

// POST /orders – create order from current user's cart
router.post(
  "/",
  requireAuth,
  validateBody(createOrderSchema),
  asyncHandler(createOrderController)
);

// GET /orders/mine – current user's orders
router.get("/mine", requireAuth, asyncHandler(getMyOrdersController));

// GET /orders/:id – current user or admin
router.get("/:id", requireAuth, asyncHandler(getOrderController));

// GET /orders – admin only, all orders
router.get(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(getAllOrdersController)
);

// PATCH /orders/:id/items – admin only, modify items of pending order
router.patch(
  "/:id/items",
  requireAuth,
  requireAdmin,
  validateBody(updateOrderItemsSchema),
  asyncHandler(updateOrderItemsController)
);

// PATCH /orders/:id/status – admin only
router.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  validateBody(updateOrderStatusSchema),
  asyncHandler(updateOrderStatusController)
);

export default router;
