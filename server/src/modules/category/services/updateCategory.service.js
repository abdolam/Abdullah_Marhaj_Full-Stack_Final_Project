import Category from "../models/category.model.js";

export const updateCategory = async (id, data) => {
  try {
    // Normalize category name if provided
    if (data.name) data.name = data.name.toLowerCase();

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw Object.assign(new Error("Category not found"), { status: 404 });
    }

    return category;
  } catch (error) {
    console.error("Failed to update category", error);
    throw error;
  }
};
