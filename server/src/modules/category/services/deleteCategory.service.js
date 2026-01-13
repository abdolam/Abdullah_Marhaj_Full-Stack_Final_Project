import Category from "../models/category.model.js";

export const deleteCategory = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw Object.assign(new Error("Category not found"), { status: 404 });
    }
    return category;
  } catch (error) {
    console.error("Failed to delete category", error);
    throw error;
  }
};
