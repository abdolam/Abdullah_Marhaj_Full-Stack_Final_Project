import Product from "../models/product.model.js";

export const updateProduct = async (id, payload) => {
  try {
    const updated = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    return updated;
  } catch (error) {
    console.error("Failed to update product", error);
    throw error;
  }
};
