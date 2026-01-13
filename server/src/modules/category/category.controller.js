import { createCategory } from "./services/createCategory.service.js";
import { deleteCategory } from "./services/deleteCategory.service.js";
import { getAllCategories } from "./services/getAllCategories.service.js";
import { getCategoryById } from "./services/getCategoryById.service.js";
import { updateCategory } from "./services/updateCategory.service.js";

// Create new category
export const create = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Failed to create category", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
export const getAll = async (_req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
export const getById = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    console.error("Failed to get category", error);
    res.status(error.status || 404).json({ message: error.message });
  }
};

// Update category
export const update = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    console.error("Failed to update category", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Delete category
export const remove = async (req, res) => {
  try {
    const category = await deleteCategory(req.params.id);
    res.status(200).json({ message: "Category deleted", category });
  } catch (error) {
    console.error("Failed to delete category", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};
