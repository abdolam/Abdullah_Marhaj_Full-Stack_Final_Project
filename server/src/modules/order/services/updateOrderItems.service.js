import Product from "../../product/models/product.model.js";
import Order from "../models/order.model.js";

export const updateOrderItems = async (orderId, itemsPayload) => {
  const order = await Order.findById(orderId).exec();
  if (!order) {
    throw Object.assign(new Error("Order not found"), { status: 404 });
  }

  const nextItems = [];

  for (const it of itemsPayload || []) {
    const productId = it?.productId || it?.product;
    const product = await Product.findById(productId).lean().exec();

    if (!product || product.isActive === false) {
      throw Object.assign(new Error("Product not found"), { status: 400 });
    }

    const quantity = Number(it?.quantity || 0);
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const price = Number(product.price || 0);
    const total = Number((price * quantity).toFixed(2));

    nextItems.push({
      product: product._id,
      name: product.name,
      quantity,
      price,
      total,
    });
  }

  const subtotal = Number(
    nextItems.reduce((sum, i) => sum + Number(i.total || 0), 0).toFixed(2)
  );

  order.items = nextItems;
  order.subtotal = subtotal;
  order.total = subtotal;

  await order.save();
  return order;
};
