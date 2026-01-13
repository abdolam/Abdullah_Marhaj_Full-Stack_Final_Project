import exporess from "express";

import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/roles.js";
import { validateBody } from "../../middlewares/validate.js";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./validation/product.validation.js";

const router = exporess.Router();

// Create new product (protected)
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createProductSchema),
  asyncHandler(create)
);

// Get all products (public)
router.get("", asyncHandler(getAll));

// Get product by ID (public)
router.get("/:id", asyncHandler(getById));

// Update product (protected)
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateProductSchema),
  asyncHandler(update)
);

// Delete product (protected)
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(remove));

export default router;
