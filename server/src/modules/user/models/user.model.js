import { model, Schema } from "mongoose";

import {
  AddressSchema,
  NameSchema,
  PresenceSchema,
  StatusSchema,
} from "./user.subSchemas.js";

const userSchema = new Schema(
  {
    name: { type: NameSchema, required: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: StatusSchema, default: () => ({}) },
    presence: { type: PresenceSchema, default: () => ({}) },
    lastActivityAt: { type: Date, default: Date.now },
    requestCount24h: { type: Number, default: 0 },
    requestWindowStart: { type: Date, default: null },
    failedLoginCount: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
