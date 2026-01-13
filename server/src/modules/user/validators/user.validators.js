import Joi from "joi";

import { EMAIL_RE, PASSWORD_RE } from "./user.regex.js";
import {
  addressSchemaJoi,
  emailFieldJoi,
  nameSchemaJoi,
  passwordFieldJoi,
  phoneFieldJoi,
} from "./user.subValidators.js";

// 1) Register
export const registerUserSchema = Joi.object({
  name: nameSchemaJoi,
  phone: phoneFieldJoi,
  email: emailFieldJoi,
  password: passwordFieldJoi,
  address: addressSchemaJoi,
});

// 2) Login
export const loginSchema = Joi.object({
  email: emailFieldJoi,
  password: Joi.string().required(),
});

// 5) Change password (self)
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(PASSWORD_RE)
    .message(
      "newPassword must be 8–64 chars and include uppercase, lowercase, digit, and special character"
    )
    .required(),
});

// 6) Forgot password
export const forgotPasswordSchema = Joi.object({
  email: emailFieldJoi,
});

// 7) Reset password (via emailed token)
export const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().min(20).required(),
  newPassword: Joi.string()
    .pattern(PASSWORD_RE)
    .message(
      "newPassword must be 8–64 chars and include uppercase, lowercase, digit, and special character"
    )
    .required(),
});

export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().optional().allow(""),
  isAdmin: Joi.boolean().optional(),
  blocked: Joi.boolean().optional(),
  sort: Joi.string().trim().optional(),
}).unknown(false);

export const ALLOWED_USER_SORTS = [
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
  "email",
  "-email",
  "name.first",
  "-name.first",
  "name.last",
  "-name.last",
  "phone",
  "-phone",
  "isAdmin",
  "-isAdmin",
  "status.blocked",
  "-status.blocked",
];
