import Category from "../models/category.model.js";

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log("[seed] categories: already present → skipping");
      return;
    }

    const categories = [
      {
        name: "heating", // automatically stored lowercase
        description: "Heating appliances and related products",
      },
      {
        name: "fuel",
        description: "Wood pellets, fuel bags, and related supplies",
      },
      {
        name: "accessories",
        description: "Additional items and accessories for EcoStore products",
      },
    ];

    await Category.insertMany(categories);
    console.log("Seeded 3 default categories successfully");
  } catch (error) {
    console.error("Failed to seed categories:", error);
    throw error;
  }
};
