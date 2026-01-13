import express from "express";

import { requireSelfOrAdmin } from "../../middlewares/access.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/roles.js";
import { validateBody, validateQuery } from "../../middlewares/validate.js";

import {
  forgotPassword,
  getById,
  list,
  login,
  register,
  resetPassword,
  updatePassword,
} from "./user.controller.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  listUsersQuerySchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "./validators/user.validators.js";

const router = express.Router();

router.post("/", validateBody(registerUserSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));

router.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(listUsersQuerySchema),
  asyncHandler(list)
);

router.get(
  "/:id",
  requireAuth,
  requireSelfOrAdmin("id"),
  asyncHandler(getById)
);

router.patch(
  "/:id/update-password",
  requireAuth,
  requireSelfOrAdmin("id"),
  validateBody(changePasswordSchema),
  asyncHandler(updatePassword)
);

router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  asyncHandler(resetPassword)
);

export default router;
