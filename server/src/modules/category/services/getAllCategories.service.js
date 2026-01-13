import Category from "../models/category.model.js";

export const getAllCategories = async () => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean().exec();
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};
