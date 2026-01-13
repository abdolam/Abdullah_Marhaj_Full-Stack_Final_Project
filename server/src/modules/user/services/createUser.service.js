import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import { toPublic } from "../user.controller.js";

export async function createUser(input) {
  const email = String(input?.email ?? "")
    .trim()
    .toLowerCase();

  const password = String(input?.password ?? "");
  const name = typeof input?.name === "string" ? input.name.trim() : "";

  if (!email) {
    throw Object.assign(new Error("Email is required"), { status: 400 });
  }
  if (!password || password.length < 6) {
    throw Object.assign(new Error("Password must be at least 6 characters"), {
      status: 400,
    });
  }

  // Uniqueness guard
  const exists = await User.findOne({ email }).lean().exec();
  if (exists) {
    throw Object.assign(new Error("Email already in use"), { status: 409 });
  }

  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: passwordHash,
    ...(name ? { name } : {}),
    isAdmin: false, // never allow self-assign admin
  });

  return toPublic(user.toObject());
}
