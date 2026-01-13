import { signAuthToken } from "../../utils/jwt.js";

import { clearLock, isLocked, lockUser } from "./helpers/lock.js";
import { minutesToHM } from "./helpers/minutesToHM.js";
import { verifyCredentials } from "./helpers/verifyCredentials.js";
import { User } from "./models/user.model.js";
import { changePassword } from "./services/changePassword.service.js";
import { createUser } from "./services/createUser.service.js";
import { forgotPassword as forgotPasswordSvc } from "./services/forgotPassword.service.js";
import { getUserByIdPublic } from "./services/getUserByIdPublic.service.js";
import { listUsers } from "./services/listUsers.service.js";
import { resetPassword as resetPasswordSvc } from "./services/resetPassword.service.js";

export function toPublic(u) {
  const {
    _id,
    name,
    phone,
    email,
    image,
    address,
    isBusiness,
    isAdmin,
    status,
    presence,
    createdAt,
    updatedAt,
  } = u;

  return {
    _id,
    name,
    phone,
    email,
    image,
    address, // keep for FE profile
    isBusiness,
    isAdmin,
    status,
    presence,
    createdAt,
    updatedAt,
  };
}

export const register = async (req, res) => {
  const user = await createUser(req.body);

  // Lightweight: NO welcome email

  res.status(201).json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Policy: default = lock after 1 failure for 24h (configurable)
  const THRESHOLD = Number(process.env.LOGIN_FAIL_THRESHOLD ?? 1);
  const LOCK_MIN = Number(process.env.LOGIN_FAIL_LOCK_MINUTES ?? 1440);

  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();

  // Load user (we need the doc to update counters even on failure)
  const user = await User.findOne({ email: normalizedEmail }).exec();

  // If user exists and is locked, block early (don’t reveal existence)
  if (user && isLocked(user)) {
    const minutesLeft = Math.max(
      1,
      Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000))
    );
    throw Object.assign(
      new Error(`Account locked. Try again in ${minutesToHM(minutesLeft)}`),
      { status: 403 }
    );
  }

  const verified = await verifyCredentials(normalizedEmail, password);

  if (!verified) {
    if (user) {
      user.failedLoginCount = (user.failedLoginCount || 0) + 1;
      if (user.failedLoginCount >= THRESHOLD) {
        lockUser(user, LOCK_MIN);
      }
      await user.save();
    }
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  if (user && (user.failedLoginCount || user.lockUntil)) {
    clearLock(user);
  }
  if (user) {
    user.lastActivityAt = new Date();
    await user.save({ validateBeforeSave: false });
  }

  // Keep MD behavior: if an admin manually blocks a user via DB, login is denied
  if (verified.status?.blocked) {
    throw Object.assign(new Error("Account is blocked"), { status: 403 });
  }

  const token = signAuthToken({
    _id: String(verified._id),
    isBusiness: !!verified.isBusiness,
    isAdmin: !!verified.isAdmin,
  });

  res.json({ token, user: toPublic(verified) });
};

// Admin: list users with paging/search/filters/sort + summaries
export const list = async (req, res) => {
  const result = await listUsers(req.validatedQuery ?? req.query);
  res.json(result);
};

// Self or Admin: get single user by id
export const getById = async (req, res) => {
  const id = req.params.id;
  const user = await getUserByIdPublic(id);
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  res.json(user);
};

// Self or Admin: change password (requires current password)
// Lightweight: NO email (handled in service)
export const updatePassword = async (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;

  // prevent admin from changing another admin's password
  if (String(req.user?._id) !== id) {
    const target = await User.findById(id).select({ isAdmin: 1 }).lean().exec();
    if (!target)
      throw Object.assign(new Error("User not found"), { status: 404 });
    if (target.isAdmin) {
      throw Object.assign(
        new Error("Admin cannot change another admin's password"),
        { status: 403 }
      );
    }
  }

  await changePassword(id, currentPassword, newPassword);
  res.status(204).send();
};

// Public: start forgot-password flow (email with reset link)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  await forgotPasswordSvc(email);
  res.status(204).send();
};

// Public: complete reset with token + new password
// Lightweight: NO email (handled in service)
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  await resetPasswordSvc(token, newPassword);
  res.status(204).send();
};
