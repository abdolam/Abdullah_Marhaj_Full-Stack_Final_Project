import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).exec();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    throw Object.assign(new Error("Current password is incorrect"), {
      status: 400,
    });
  }

  const sameAsCurrent = await bcrypt.compare(newPassword, user.password);
  if (sameAsCurrent) {
    throw Object.assign(new Error("Cannot reuse the current password"), {
      status: 400,
    });
  }

  const SALT_ROUNDS = 10;
  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password = newHash;
  await user.save();

  // Lightweight: NO email confirmation
  // Lightweight: NO password history
}
