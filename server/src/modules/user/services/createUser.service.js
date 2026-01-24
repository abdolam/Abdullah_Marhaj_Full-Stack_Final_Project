import bcrypt from "bcrypt";

import { User } from "../models/user.model.js";
import { toPublic } from "../user.controller.js";

export async function createUser(input) {
  const email = String(input?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(input?.password ?? "");

  const name = input?.name;
  const phone = String(input?.phone ?? "").trim();
  const address = input?.address;

  if (!email) {
    throw Object.assign(new Error("Email is required"), { status: 400 });
  }

  // Keep project rule: password policy is enforced by Joi in registerUserSchema.
  // Here we only do a basic guard.
  if (!password) {
    throw Object.assign(new Error("Password is required"), { status: 400 });
  }

  // Validate required fields matching the Mongoose schema shape
  const first = String(name?.first ?? "").trim();
  const last = String(name?.last ?? "").trim();

  if (!first || !last) {
    throw Object.assign(new Error("Name is required"), { status: 400 });
  }

  if (!phone) {
    throw Object.assign(new Error("Phone is required"), { status: 400 });
  }

  if (!address || typeof address !== "object") {
    throw Object.assign(new Error("Address is required"), { status: 400 });
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

    name: { first, last },
    phone,
    address: {
      city: String(address.city ?? "").trim(),
      street: String(address.street ?? "").trim(),
      houseNumber: Number(address.houseNumber),
      zip: Number(address.zip),
    },

    isAdmin: false, // never allow self-assign admin
  });

  return toPublic(user.toObject());
}
