import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(2).max(10000).required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  isActive: Joi.boolean().default(true),
}).unknown(true); // ✅ IMPORTANT

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().min(2).max(10000),
  price: Joi.number().min(0),
  image: Joi.string().trim(),
  category: Joi.string().trim(),
  isActive: Joi.boolean(),
})
  .min(1)
  .unknown(true); // ✅ IMPORTANT
