import express from "express";

import cartRoutes from "../modules/cart/cart.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import orderRoutes from "../modules/order/order.routes.js";
import productRoutes from "../modules/product/product.routes.js";
import userRoutes from "../modules/user/user.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;
