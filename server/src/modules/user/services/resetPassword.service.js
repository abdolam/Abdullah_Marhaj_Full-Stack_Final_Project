import bcrypt from "bcrypt";

import { sha256Hex } from "../../../utils/token.js";
import { PasswordReset } from "../models/passwordReset.model.js";
import { User } from "../models/user.model.js";
import { PASSWORD_RE } from "../validators/user.regex.js";

export async function resetPassword(rawToken, newPassword) {
  if (!rawToken || typeof rawToken !== "string") {
    throw Object.assign(new Error("Invalid token"), { status: 400 });
  }
  if (!PASSWORD_RE.test(newPassword)) {
    throw Object.assign(
      new Error(
        "Password must be 8–64 chars and include uppercase, lowercase, digit, and special character"
      ),
      { status: 400 }
    );
  }

  const tokenHash = sha256Hex(rawToken);
  const reset = await PasswordReset.findOne({ tokenHash }).exec();
  if (!reset) {
    throw Object.assign(new Error("Invalid or expired token"), { status: 400 });
  }
  if (reset.usedAt) {
    throw Object.assign(new Error("Token already used"), { status: 400 });
  }
  if (reset.expiresAt.getTime() <= Date.now()) {
    throw Object.assign(new Error("Token expired"), { status: 400 });
  }

  const user = await User.findById(reset.userId).exec();
  if (!user) {
    await PasswordReset.updateOne(
      { _id: reset._id },
      { $set: { usedAt: new Date() } }
    );
    throw Object.assign(new Error("User not found"), { status: 404 });
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

  await PasswordReset.updateOne(
    { _id: reset._id },
    { $set: { usedAt: new Date() } }
  ).exec();

  // Lightweight: NO email confirmation
  // Lightweight: NO password history
}
