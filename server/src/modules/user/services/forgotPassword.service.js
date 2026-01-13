import { appConfig } from "../../../config/env.js";
import { buildResetPasswordEmail } from "../../../mails/resetPassword.js";
import { sendMail } from "../../../utils/mailer.js";
import { makeTokenPair } from "../../../utils/token.js";
import { PasswordReset } from "../models/passwordReset.model.js";
import { User } from "../models/user.model.js";

const ttlStr = process.env.RESET_TTL_MINUTES ?? "30";
const ttlMinutes = Number(ttlStr) || 30;

export async function forgotPassword(email) {
  if (typeof email !== "string") {
    const err = new Error("email must be a string");
    err.status = 400;
    throw err;
  }

  const normalized = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalized }).lean().exec();

  if (!user) return;

  await PasswordReset.deleteMany({ userId: user._id }).exec();

  const { raw, hash } = makeTokenPair(32);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await PasswordReset.create({
    userId: user._id,
    tokenHash: hash,
    expiresAt,
  });

  const base = appConfig.appBaseUrl?.replace(/\/+$/, "") ?? "";
  const link = `${base}/reset-password?token=${encodeURIComponent(raw)}`;

  const emailContent = buildResetPasswordEmail(normalized, link, ttlMinutes);
  await sendMail({ to: normalized, ...emailContent });
}
