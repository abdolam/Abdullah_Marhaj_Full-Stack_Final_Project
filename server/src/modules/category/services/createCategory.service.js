import Category from "../models/category.model.js";

export const createCategory = async (data) => {
  try {
    // Normalize category name to lowercase (for consistent storage & search)
    data.name = data.name.toLowerCase();

    // Check if category already exists
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw new Error("Category with this name already exists");
    }

    const category = await Category.create(data);
    return category;
  } catch (error) {
    console.error("Failed to create category", error);
    throw error;
  }
};
