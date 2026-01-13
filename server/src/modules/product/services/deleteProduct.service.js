import Product from "../models/product.model.js";

export const deleteProduct = async (id) => {
  try {
    const deleted = await Product.findByIdAndDelete(id).lean().exec();
    return deleted;
  } catch (error) {
    console.error("Failed to delete product", error);
    throw error;
  }
};
