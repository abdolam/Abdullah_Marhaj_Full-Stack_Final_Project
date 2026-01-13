import Product from "../models/product.model.js";

export const getProductsByCategory = async (category) => {
  try {
    const products = await Product.find({ category, isActive: true })
      .lean()
      .exec();
    return products;
  } catch (error) {
    console.error("Failed to fetch products by category", error);
    throw error;
  }
};
