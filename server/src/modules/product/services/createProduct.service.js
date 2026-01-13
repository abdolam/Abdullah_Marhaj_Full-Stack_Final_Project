import Product from "../models/product.model.js";

export const createProduct = async (payload) => {
  try {
    const product = await Product.create(payload);
    return product.toObject ? product.toObject() : product;
  } catch (error) {
    console.error("Failed to create product", error);
    throw error;
  }
};
