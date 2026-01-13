import Category from "../models/category.model.js";

export const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id).lean().exec();
    if (!category) {
      throw Object.assign(new Error("Category not found"), { status: 404 });
    }
    return category;
  } catch (error) {
    console.error("Failed to get category by ID", error);
    throw error;
  }
};
