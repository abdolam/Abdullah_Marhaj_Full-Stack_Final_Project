import mongoose from "mongoose";

const httpUrlRegex =
  /^(https?:\/\/)([\w.-]+\.)+[\w.-]+(\/[\w.,@?^=%&:/~+#-]*)?$/i;

const uploadsPathRegex = /^\/uploads\/[a-z0-9/_-]+\.(webp|jpg|jpeg|png)$/i;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    // Optional: kept to avoid breaking FE cards that display shortDescription
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 240,
      default: "",
    },

    // Single description field (required)
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 10000,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Single image only
    image: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (v) =>
          httpUrlRegex.test(v) || uploadsPathRegex.test(String(v)),
        message: "Invalid image URL/path",
      },
    },

    category: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Product", productSchema);
