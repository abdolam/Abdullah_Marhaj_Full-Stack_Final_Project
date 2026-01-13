import Product from "../models/product.model.js";

export const getProductById = async (id) => {
  try {
    const product = await Product.findOne({ _id: id, isActive: true })
      .lean()
      .exec();
    return product;
  } catch (error) {
    console.error("Failed to fetch product by id", error);
    throw error;
  }
};
