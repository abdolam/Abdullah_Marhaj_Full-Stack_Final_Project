import Cart from "../../cart/models/cart.model.js";
import Product from "../../product/models/product.model.js";
import Order from "../models/order.model.js";

// Keep existing behavior: you saw ORD1766...
function generateOrderNumber() {
  return `ORD${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}

export const createOrderFromCart = async (userId, data = {}) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product")
    .exec();

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw Object.assign(new Error("Cart is empty"), { status: 400 });
  }

  const items = [];

  for (const item of cart.items) {
    const productId = item.product?._id || item.product;
    const product = await Product.findById(productId).lean().exec();

    if (!product || product.isActive === false) {
      throw Object.assign(new Error("Product not found"), { status: 400 });
    }

    const quantity = Number(item.quantity || 0);
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const price = Number(product.price || 0);
    const total = Number((price * quantity).toFixed(2));

    items.push({
      product: product._id,
      name: product.name,
      quantity,
      price,
      total,
    });
  }

  if (items.length === 0) {
    throw Object.assign(new Error("No valid items to order"), { status: 400 });
  }

  const subtotal = Number(
    items.reduce((sum, it) => sum + Number(it.total || 0), 0).toFixed(2)
  );

  const order = await Order.create({
    user: userId,
    orderNumber: generateOrderNumber(),
    items,
    subtotal,
    total: subtotal,
    status: "pending",
    paymentMethod: data?.paymentMethod || "card",
    notes: data?.notes || "",
  });

  // Clear cart after successful order creation
  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;
  await cart.save();

  return order;
};
