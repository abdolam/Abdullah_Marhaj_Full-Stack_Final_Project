import express from "express";

import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validate.js";

import {
  getCartController,
  getCartSummaryController,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from "./cart.controller.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "./validation/cart.validation.js";

const router = express.Router();

// GET /cart
router.get("/", requireAuth, asyncHandler(getCartController));

// GET /cart/summary
router.get("/summary", requireAuth, asyncHandler(getCartSummaryController));

// POST /cart/add
router.post(
  "/add",
  requireAuth,
  validateBody(addToCartSchema),
  asyncHandler(addToCartController)
);

// PUT /cart
router.put(
  "/update/:productId",
  requireAuth,
  validateBody(updateCartItemSchema),
  asyncHandler(updateCartItemController)
);

// DELETE /cart/:productId
router.delete(
  "/remove/:productId",
  requireAuth,
  asyncHandler(removeCartItemController)
);

// DELETE /cart
router.delete("/clear", requireAuth, asyncHandler(clearCartController));

export default router;
