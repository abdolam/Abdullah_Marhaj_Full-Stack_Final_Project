import express from "express";

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
} from "./category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./validation/category.validation.js";

const router = express.Router();

// Public routes
router.get("/", asyncHandler(getAll));
router.get("/:id", asyncHandler(getById));

// Admin routes
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createCategorySchema),
  asyncHandler(create)
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateCategorySchema),
  asyncHandler(update)
);

router.delete("/:id", requireAuth, requireAdmin, asyncHandler(remove));

export default router;
