import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const productIdField = Joi.string()
  .trim()
  .pattern(objectIdPattern)
  .message("productId must be a valid MongoDB ObjectId");

// POST /cart/add
export const addToCartSchema = Joi.object({
  productId: productIdField.required(),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "quantity must be a number",
    "number.integer": "quantity must be an integer",
    "number.min": "quantity must be at least 1",
    "any.required": "quantity is required",
  }),
});

// PUT /cart/update/:productId
export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "quantity must be a number",
    "number.integer": "quantity must be an integer",
    "number.min": "quantity must be at least 1",
    "any.required": "quantity is required",
  }),
});
