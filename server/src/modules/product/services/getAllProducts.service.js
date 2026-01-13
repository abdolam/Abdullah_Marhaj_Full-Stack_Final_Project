import Product from "../models/product.model.js";

export const getAllProducts = async () => {
  try {
    const products = await Product.find({ isActive: true }).lean().exec();
    return products;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};
