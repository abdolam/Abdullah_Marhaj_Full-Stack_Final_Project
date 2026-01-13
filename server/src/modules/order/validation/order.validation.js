import Joi from "joi";

export const createOrderSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid("card", "paypal", "bit", "phone")
    .default("card"),
  notes: Joi.string().trim().max(500).allow("").default(""),
}).unknown(false);

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "shipped", "completed", "cancelled")
    .required(),
}).unknown(false);

export const updateOrderItemsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().trim().required(),
        quantity: Joi.number().integer().min(1).required(),
      }).unknown(false)
    )
    .min(1)
    .required(),
}).unknown(false);
