import { createProduct } from "../product/services/createProduct.service.js";
import { deleteProduct } from "../product/services/deleteProduct.service.js";
import { getAllProducts } from "../product/services/getAllProducts.service.js";
import { getProductById } from "../product/services/getProductById.service.js";
import { updateProduct } from "../product/services/updateProduct.service.js";

import { getProductsByCategory } from "./services/getProductsByCategory.service.js";

export const create = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Failed to create product", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to get products", error);
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Failed to get product", error);
    res.status(500).json({ message: error.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || "").trim();
    const products = await getProductsByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to get products by category", error);
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error) {
    console.error("Failed to update product", error);
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Failed to delete product", error);
    res.status(500).json({ message: error.message });
  }
};
