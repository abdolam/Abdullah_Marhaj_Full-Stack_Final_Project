import { Schema } from "mongoose";

export const NameSchema = new Schema(
  {
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true },
  },
  { _id: false }
);

export const AddressSchema = new Schema(
  {
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    houseNumber: { type: Number, required: true },
    zip: { type: Number, required: true },
  },
  { _id: false }
);

export const StatusSchema = new Schema(
  {
    blocked: { type: Boolean, default: false },
  },
  { _id: false }
);

export const PresenceSchema = new Schema(
  {
    lastSeen: { type: Date },
    isConnected: { type: Boolean, default: false },
  },
  { _id: false }
);
