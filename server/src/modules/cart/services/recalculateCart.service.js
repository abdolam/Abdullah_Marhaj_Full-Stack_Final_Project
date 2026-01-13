import Product from "../../product/models/product.model.js";

export const recalculateCart = async (cart) => {
  try {
    const nextItems = [];

    for (const item of cart.items || []) {
      const productId = item.product?._id || item.product;

      const product = await Product.findById(productId).lean().exec();

      // If product does not exist or inactive, drop from cart
      if (!product || product.isActive === false) continue;

      const quantity = Number(item.quantity || 0);
      if (!Number.isFinite(quantity) || quantity <= 0) continue;

      const price = Number(product.price || 0);
      const total = Number((price * quantity).toFixed(2));

      nextItems.push({
        product: product._id,
        quantity,
        price,
        total,
      });
    }

    cart.items = nextItems;

    const subtotal = Number(
      nextItems.reduce((sum, it) => sum + Number(it.total || 0), 0).toFixed(2)
    );

    cart.subtotal = subtotal;
    cart.total = subtotal;

    await cart.save();

    // Populate products for FE convenience
    await cart.populate("items.product");

    return cart;
  } catch (error) {
    console.error("Failed to recalculate cart", error);
    throw error;
  }
};
