import { addToCart } from "./services/addToCart.service.js";
import { clearCart } from "./services/clearCart.service.js";
import { getCart } from "./services/getCart.service.js";
import { getCartSummary } from "./services/getCartSummary.service.js";
import { removeCartItem } from "./services/removeCartItem.service.js";
import { updateCartItem } from "./services/updateCartItem.service.js";

const getUserIdFromRequest = (req) => req.user?.id || req.user?._id;

// GET /cart
export const getCartController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const cart = await getCart(userId);
  res.status(200).json(cart);
};

// GET /cart/summary
export const getCartSummaryController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const summary = await getCartSummary(userId);
  res.status(200).json(summary);
};

// POST /cart/add
export const addToCartController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { productId, quantity } = req.body;

  const cart = await addToCart(userId, productId, quantity);
  res.status(200).json({
    message: "Item added to cart",
    cart,
  });
};

// PUT /cart/update/:productId
export const updateCartItemController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await updateCartItem(userId, productId, quantity);
  res.status(200).json({
    message: "Cart item updated",
    cart,
  });
};

// DELETE /cart/remove/:productId
export const removeCartItemController = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { productId } = req.params;

  const cart = await removeCartItem(userId, productId);
  res.status(200).json({
    message: "Cart item removed",
    cart,
  });
};

// DELETE /cart/clear
export const clearCartController = async (req, res) => {
  const userId = getUserIdFromRequest(req);

  const cart = await clearCart(userId);
  res.status(200).json({
    message: "Cart cleared",
    cart,
  });
};
