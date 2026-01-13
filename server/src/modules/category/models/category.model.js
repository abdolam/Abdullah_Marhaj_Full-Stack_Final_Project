import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
      unique: true,
      lowercase: true, // always store in lowercase
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ensure uniqueness in a case-insensitive way
categorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "simple" } }
);

export default mongoose.model("Category", categorySchema);
