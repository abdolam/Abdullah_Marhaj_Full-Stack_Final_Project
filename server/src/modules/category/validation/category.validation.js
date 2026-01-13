import Joi from "joi";

//Create Category Validation
export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  description: Joi.string().max(200).allow(""),
  isActive: Joi.boolean().default(true),
});

//Update Category Validation
export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(60),
  description: Joi.string().max(200).allow(""),
  isActive: Joi.boolean(),
});
